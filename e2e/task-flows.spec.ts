import { test, expect, requireTestAccount, TEST_EMAIL, TEST_PASSWORD } from './fixtures'

/**
 * The critical path this whole app is built around: create a task,
 * assign it, complete it. One continuous flow rather than three
 * isolated tests, because the real value is proving the handoffs
 * between steps work — a task created by fast entry is the same task
 * you can open, assign, and check off.
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

    // --- open it, assign it to the signed-in user ---
    await taskButton.click()
    await page.getByLabel('Task title').waitFor()
    await page.getByRole('combobox', { name: /assignee/i }).click()
    await page.getByRole('option').filter({ hasNotText: 'Unassigned' }).first().click()

    // --- complete it, from inside the detail pane ---
    await page.getByRole('checkbox', { name: /mark complete/i }).check()
    await page.keyboard.press('Escape')

    // Struck through in the list — the visible sign a task is done.
    await expect(taskButton.locator('span')).toHaveClass(/line-through/)

    // --- clean up: archive the test project ---
    await page.getByRole('button', { name: 'Archive' }).click()
    await page.getByRole('button', { name: 'Archive project' }).click()
    await expect(page).toHaveURL('/team/projects')
    await expect(page.getByText(projectName)).not.toBeVisible()
  })
})
