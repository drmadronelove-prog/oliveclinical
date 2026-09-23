import { test, expect, requireTestAccount, TEST_EMAIL, TEST_PASSWORD } from './fixtures'

/**
 * The critical path this whole app is built around: create a task,
 * assign it, complete it. One continuous flow rather than three
 * isolated tests, because the real value is proving the handoffs
 * between steps work — a task created by fast entry is the same task
 * you can open, assign, and check off.
 *
 * Every mutation on this page is optimistic: the checkbox ticks and the
 * assignee appears the instant you click, before the server has said
 * anything. So asserting on what the screen shows proves only that the
 * optimistic update ran — a save that failed on the server would look
 * identical until the next load. That is why this flow reloads the page
 * and re-asserts: the reload re-reads from the database, so anything
 * still there afterwards was really written.
 */
test.describe('task flows', () => {
  test.beforeEach(() => requireTestAccount())

  test('create a project, add a task, assign it, complete it', async ({ page }) => {
    const projectName = `Playwright test ${Date.now()}`
    const taskTitle = 'Draft the launch email'

    // --- sign in ---
    await page.goto('/team/login')
    await page.getByLabel('Email').fill(TEST_EMAIL!)
    await page.getByLabel('Password').fill(TEST_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/team')

    // --- create a project ---
    await page.goto('/team/projects')
    await page.getByRole('button', { name: 'New project' }).click()
    await page.getByLabel('Name').fill(projectName)
    await page.getByRole('button', { name: 'Create project' }).click()
    await expect(page.getByRole('heading', { name: projectName })).toBeVisible()

    // --- fast task entry: type, Enter, it appears ---
    await page.getByLabel('Add task').fill(taskTitle)
    await page.getByLabel('Add task').press('Enter')
    const taskButton = page.getByRole('button', { name: taskTitle })
    await expect(taskButton).toBeVisible()

    // The input keeps focus and is empty, ready for the next task —
    // the whole point of fast entry.
    await expect(page.getByLabel('Add task')).toBeFocused()
    await expect(page.getByLabel('Add task')).toHaveValue('')

    // --- open it, assign it ---
    await taskButton.click()
    await page.getByLabel('Task title').waitFor()
    // The list row behind the sheet carries its own checkbox, labelled
    // `Mark "<title>" complete`. Scoping to the open sheet keeps these
    // locators from matching both and tripping strict mode.
    const sheet = page.getByRole('dialog')
    const assignee = sheet.getByRole('combobox', { name: /assignee/i })
    await assignee.click()
    await page.getByRole('option').filter({ hasNotText: 'Unassigned' }).first().click()
    // Whoever that turned out to be — read it back so the reload below
    // can check for the same person rather than merely "someone".
    await expect(assignee).not.toHaveText(/assignee/i)
    const assignedTo = ((await assignee.textContent()) ?? '').trim()
    expect(assignedTo).not.toBe('')

    // --- complete it, from inside the detail pane ---
    await sheet.getByRole('checkbox', { name: 'Mark complete', exact: true }).check()
    await page.keyboard.press('Escape')

    // Struck through in the list — the visible sign a task is done.
    await expect(taskButton.locator('span')).toHaveClass(/line-through/)

    // --- the part that proves it saved ---
    // Everything above could pass on optimistic state alone. Reload, so
    // every assertion below is answered by the database.
    await page.reload()

    const reloadedTask = page.getByRole('button', { name: taskTitle })
    await expect(reloadedTask).toBeVisible()
    await expect(reloadedTask.locator('span')).toHaveClass(/line-through/)

    await reloadedTask.click()
    await page.getByLabel('Task title').waitFor()
    const reopenedSheet = page.getByRole('dialog')
    const doneBox = reopenedSheet.getByRole('checkbox', { name: 'Mark incomplete', exact: true })
    await expect(doneBox).toBeChecked()
    await expect(reopenedSheet.getByRole('combobox', { name: /assignee/i })).toHaveText(assignedTo)

    // --- and that unchecking saves too, not just checking ---
    await doneBox.uncheck()
    await page.keyboard.press('Escape')
    await page.reload()
    const reopened = page.getByRole('button', { name: taskTitle })
    await expect(reopened.locator('span')).not.toHaveClass(/line-through/)

    // --- clean up: archive the test project ---
    await page.getByRole('button', { name: 'Archive' }).click()
    await page.getByRole('button', { name: 'Archive project' }).click()
    await expect(page).toHaveURL('/team/projects')
    await expect(page.getByText(projectName)).not.toBeVisible()
  })
})
