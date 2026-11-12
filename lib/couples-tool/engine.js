// Couples Classification Interactive Tool: questions, lenses, scoring and
// view-model. Ported from the Olive Clinical design canvas. Plain JS so the
// logic stays identical to the prototype; the React component only renders.
/* eslint-disable */
const DATA=[
["Core axes",[
["Self-doubting + self-certain pairing",{ip:"Self-doubting partner",ep:"Self-certain partner, loud",ew:"Self-certain partner, cold"},"The self-doubting partner sits in the anxious-pursuer cell. The self-certain partner is either a critical pursuer (high-conflict, escalating) or a dismissive withdrawer (withholding as punishment, which drives more pursuit)."],
["Internalizer / externalizer",{ip:"Internalizer",iw:"Internalizer",ep:"Externalizer",ew:"Externalizer"},"The blame axis: where responsibility and distress land after a rupture. The rows of the grid."],
["Pursuer / withdrawer (EFT)",{ip:"Pursuer",ep:"Pursuer",iw:"Withdrawer",ew:"Withdrawer"},"The distance axis: what each partner does with closeness under threat. The columns of the grid. EFT assumes equal attachment vulnerability on both sides, which can understate a strong externalizer."]]],
["Attachment",[
["Attachment styles",{ip:"Anxious-preoccupied",ep:"Anxious, protesting",iw:"Fearful-avoidant",ew:"Dismissive-avoidant"},"Bowlby, Ainsworth, Bartholomew. Attachment maps mainly onto the distance axis: anxious styles hyperactivate (pursue), avoidant styles deactivate (withdraw). Anxious protest can turn critical. Fearful-avoidant partners swing between pursuit and shame withdrawal. Secure partners can flex across all four cells instead of getting stuck in one.","Secure: no fixed cell"],
["Anxious-avoidant trap",{ip:"Anxious partner",ew:"Avoidant partner"},"Each partner's strategy triggers the other's: pursuit feels like engulfment to the avoidant partner, and distance feels like abandonment to the anxious one. Diagonal placement is the classic version. When the avoidant partner also externalizes, the anxious partner absorbs the blame too."]]],
["Roles",[
["Overfunctioner / underfunctioner",{ip:"Overfunctioner",ep:"Overfunctioner, nagging",iw:"Underfunctioner",ew:"Underfunctioner, checked out"},"Bowen, Lerner. Tracks who carries tasks and competence, not blame. Overfunctioners usually pursue; they can internalize (anxious) or externalize (critical)."],
["ADHD / parent partner",{ep:"Parent partner",iw:"ADHD partner"},"Orlov. The non-ADHD partner becomes the critical pursuer and manager; the ADHD partner drifts into shame withdrawal. Both end up lonely."],
["Caretaker / patient",{ip:"Caretaker",iw:"Identified patient"},"One partner's identity organizes around the other's illness. Recovery threatens the caretaker's role."],
["Drama triangle",{ep:"Persecutor",ip:"Rescuer",iw:"Victim"},"Karpman. Roles rotate mid-fight, so one partner can pass through several cells in a single argument."]]],
["Structure",[
["Complementary vs. symmetrical",{ip:"One-down",iw:"One-down",ep:"One-up",ew:"One-up"},"Bateson. Complementary couples sit in opposite cells and escalate by polarizing. Symmetrical couples share a row or column and escalate by matching."],
["Polarization (IBCT)",{ip:"Exaggerated pole",iw:"Exaggerated pole",ep:"Exaggerated pole",ew:"Exaggerated pole"},"Christensen. An ordinary difference gets pushed toward the corners by the conflict over it. Acceptance work pulls partners back toward the center."],
["Triangulation",{},"Bowen. Lives outside the grid: anxiety routes through a third party (a child, an in-law, an affair, a phone, or the therapist as judge).","Outside the grid: a third party absorbs the tension"]]],
["Unconscious fit",[
["Collusion",{ip:"Carries shared doubt",ep:"Carries shared certainty",ew:"Carries shared certainty"},"Dicks, Willi. Each partner holds a disowned part of the other. Explains why the pairing feels chosen, and why one partner's change destabilizes both."],
["Fusion vs. differentiation",{ip:"Fusion: merge",ep:"Fusion: control",iw:"Cutoff",ew:"Cutoff"},"Bowen, Schnarch. Low differentiation drives every cell: pursuit to merge or control, withdrawal to escape. Higher differentiation pulls toward the center."]]],
["Process markers",[
["Four Horsemen",{ep:"Criticism, defensiveness",ew:"Contempt, stonewalling",iw:"Stonewalling, flooded"},"Gottman. Contempt is the strongest predictor of divorce and the one to watch with a self-certain partner. Flooded stonewalling differs from cold stonewalling."]]],
["Commitment and desire",[
["Mixed-agenda couple",{ip:"Leaning in",ep:"Leaning in",iw:"Leaning out",ew:"Leaning out"},"Doherty, discernment counseling. Assess early; standard couples therapy assumes both partners are in."],
["Desire discrepancy",{ip:"Higher desire",ep:"Higher desire",iw:"Lower desire",ew:"Lower desire"},"The same pursue/withdraw cycle in the sexual domain."]]],
["Neurodivergent",[
["Double empathy problem",{},"Milton. A cross-neurotype mismatch can masquerade as any cell. Autistic shutdown can look like dismissive withdrawal; direct communication can read as criticism. Check before assigning a cell.","A caution layer over all four cells"]]]
];
const FREQ=["Rarely","Sometimes","Often","Almost always"];
const GUESS=[["ip","Reaches out, and worries it's their fault"],["iw","Goes quiet, and feels like they're failing"],["ep","Pushes, and points out what's wrong"],["ew","Shuts the door and waits it out"],["xw","Pretends everything is fine and waits it out without addressing the tension"]];
const PREG=[[3,"With respect, even when upset"],[2,"Mostly respectfully, with some sharp moments"],[1,"Often dismissive or sarcastic"],[0,"With disdain: eye-rolling, mockery, or talking down"]];
const PCTL=[["O","Hold it in and stay tightly controlled"],["U","Let it out fast and say what they feel"],["S","Hold it in, then it bursts out"],["F","Hold back or let go, depending on the moment"]];
const CMT=[[3,"All in, and want to make this work"],[2,"In, but tired"],[1,"Unsure whether I want to stay"],[0,"Leaning toward leaving"]];
const AGREE=["Not true","A little true","Mostly true","Very true"];
const QS=[
["d","When there's tension between us, I…","Want to talk it through now","Need space before I can talk"],
["b","When something goes wrong between us, my first thought is…","\"What did I do?\"","\"Why did you do that?\""],
["d","If you go quiet, I…","Reach out more and ask what's wrong","Give you space, and feel some relief"],
["b","When you're unhappy with me, I mostly feel…","Ashamed or anxious","Unfairly criticized"],
["d","In the middle of a fight, I'm more likely to…","Keep pressing or raise my voice","Shut down or go blank"],
["b","In arguments, I'm more likely to…","Apologize, even when I'm not sure I'm wrong","Explain why I was right"],
["d","After a fight, I…","Need to know we're okay","Prefer to move on without revisiting it"],
["b","When I replay a fight, I mostly think about…","What I should have done differently","What you should have done differently"],
["d","When I'm upset with you, I…","Tell you, sometimes more than once","Keep it to myself"],
["b","If a close friend described our pattern, they'd say I…","Take on too much of the blame","Don't take on enough of it"],
["r","In a conflict, my feelings go from zero to a hundred fast."],
["r","My body reacts strongly when we argue: racing heart, heat, a tight chest."],
["r","I say or do things in a fight that I regret later."],
["r","It takes me hours or longer to settle after a fight."],
["g","I notice when I'm getting flooded and pause before it escalates."],
["g","I have ways to calm myself that don't involve shutting you out, like breathing, moving, or a walk."],
["g","After a break, I come back to finish the conversation."],
["x","To get through a fight (or to ground myself after a fight), I numb out, distract myself, or reach for something (alcohol, food, my phone)."],
["gr","When my partner tries to make up after a fight, with a joke, a touch, or an apology, I can let it in."],
["c","I'm willing to change how I act in conflict, even if my partner doesn't change first."],
["c","I've already started trying to do something differently."],
["c","I'm willing to put real time into this, in sessions and in practice between them."],
["cx","Honestly, things would be fine if my partner changed."],
["cm","Where are you right now with this relationship?"],
["s","After a fight, the part you replay most is…","What was said, word for word","The moment it turned, and what you felt right before","b"],
["s","When your partner says \"You always do this,\" your first reaction is usually…","Thinking of the times you didn't","Wondering what \"this\" looks like from their side","b"],
["s","If you could change one thing about your fights, it would be…","What you do in the first minute","How your partner responds to you","a"],
["s","A friend offers unasked-for feedback about how you act in your relationship. You'd most likely…","Figure they don't know the whole story","Feel stung, then wonder if they have a point","b"],
["s","When you get upset over something small, it usually turns out…","There was something bigger underneath","It was a reasonable reaction to the small thing","a"],
["rp","When we disagree, I still see my partner as someone I respect."],
["rn","Sometimes my partner's reactions seem so unreasonable it's hard not to roll my eyes."],
["rn","When I'm frustrated, I've caught myself mocking or imitating my partner, even as a joke."],
["rp","Even right after a fight, I can name things I genuinely admire about my partner."],
["cp","I follow through on what I say I'll do for us, without reminders."],
["cp","I keep track of our shared plans, bills, and logistics."],
["cn","Things I mean to do for us slip through the cracks."],
["cp","I'm on time for the things that matter to my partner."],
["oc","I hold my feelings in, even when sharing them would help."],
["uc","I act on a feeling before I've thought it through."],
["oc","When plans change at the last minute, it really throws me."],
["uc","I say what I feel in the moment and deal with the fallout later."],
["oc","I hold myself, and often others, to high standards about how things should be done."],
["uc","When I want something, waiting for it is hard."],
["oc","It's hard for me to be silly or spontaneous, even with my partner."],
["uc","My mood can shift quickly, and people around me can tell."],
["pg","When things get hard, what does your partner usually do?"],
["sg","If your partner answered that same question about you, what would they pick?"],
["pr","When you two disagree, how does your partner usually treat you?"],
["pf","When your partner says they'll handle something, how often does it get done?"],
["pc","When your partner is upset, they tend to…"]
];
const HEADS={0:["Part 1: Your moves","Pick the answer that fits you more often, even if neither fits perfectly."],10:["Part 2: How strongly you react","How often is this true for you?"],14:["Part 3: How you find your way back","How often is this true for you?"],19:["Part 4: Readiness for change","How true is this for you right now?"],24:["Part 5: How you see things","Go with your first honest reaction. Both answers are reasonable."],29:["Part 6: Respect","How true is this for you?"],33:["Part 7: Follow-through","How often is this true for you?"],37:["Part 8: Holding in, letting out","How true is this for you?"],45:["Part 9: Your partner","Your honest view and best guesses. Don't compare notes."]};
const CITE={"Your map":"Achenbach (1966); Christensen &amp; Heavey (1990); Gross (1998); Gottman (1994); Gottman &amp; Silver (1999); Prochaska &amp; DiClemente (1983); Ickes (1993); Costa &amp; McCrae (1992); Block &amp; Block (1980); Lynch (2018); Doherty et al. (2016)",
"Internalizer / externalizer":"Achenbach (1966)","Pursuer / withdrawer (EFT)":"Johnson (2004); Christensen &amp; Heavey (1990)",
"Attachment styles":"Bowlby (1969); Ainsworth et al. (1978); Bartholomew &amp; Horowitz (1991)","Anxious-avoidant trap":"Johnson (2004); Bartholomew &amp; Horowitz (1991)",
"Overfunctioner / underfunctioner":"Bowen (1978); Lerner (1985)","ADHD / parent partner":"Orlov (2010)","Caretaker / patient":"Willi (1982)","Drama triangle":"Karpman (1968)",
"Complementary vs. symmetrical":"Bateson (1958); Watzlawick et al. (1967)","Polarization (IBCT)":"Jacobson &amp; Christensen (1996)","Triangulation":"Bowen (1978)",
"Collusion":"Dicks (1967); Willi (1982)","Fusion vs. differentiation":"Bowen (1978); Schnarch (1997); Skowron &amp; Friedlander (1998)","Four Horsemen":"Gottman (1994)",
"Mixed-agenda couple":"Doherty et al. (2016)","Desire discrepancy":"Schnarch (1997)","Double empathy problem":"Milton (2012)"};
const QN={ip:"Anxious pursuer",iw:"Shame withdrawer",ep:"Critical pursuer",ew:"Dismissive withdrawer"};
const COL={ip:"159,179,176",iw:"140,155,176",ep:"196,135,126",ew:"197,165,114"};
const CELL=(k,on)=>"display: flex; flex-direction: column; gap: 8px; min-height: 176px; padding: 22px 24px; box-sizing: border-box; border-radius: 16px; background: rgba("+COL[k]+(on?",1)":",.28)")+"; border: 2px solid "+(on?"#0b2545":"rgba("+COL[k]+",.6)");
const CHIP_OFF="cursor: pointer; font-size: 13px; font-weight: 500; padding: 8px 14px; min-height: 36px; border-radius: 9999px; border: 1px solid rgba(11,37,69,.25); background: #ffffff; color: #0b2545";
const CHIP_ON="cursor: pointer; font-size: 13px; font-weight: 500; padding: 8px 14px; min-height: 36px; border-radius: 9999px; border: 1px solid #7a4f6e; background: #7a4f6e; color: #f3f3f3";
const OPT=(on,two)=>"cursor: pointer; text-align: "+(two?"left":"center")+"; flex: "+(two?"1 1 240px":"1 1 120px")+"; font-size: 15px; font-weight: "+(on?"600":"400")+"; padding: 12px 16px; min-height: 48px; border-radius: 10px; border: "+(on?"2px solid #0b2545":"1px solid rgba(11,37,69,.25)")+"; background: "+(on?"#0b2545":"#f3f3f3")+"; color: "+(on?"#f3f3f3":"#0b2545");
const PAIR={
diag:"You're in opposite corners. Each of your moves sets off the other's: one of you reaches while the other pulls away, and one holds the blame the other puts down. Naming the cycle together is usually the first step out of it.",
distMe:"One of you reaches and one retreats, and you both tend to blame yourselves. Fights may stay quiet, but both of you can end up feeling alone and at fault.",
distYou:"One of you reaches and one retreats, and you both tend to locate the problem in the other. Blame can escalate on both sides; slowing down the moment right after a rupture helps most.",
blame:"You handle closeness the same way, but one of you tends to hold the blame while the other places it. Over time, one person can end up owning every problem.",
same:"You both go to the same place under stress. Patterns like this escalate by matching: two pursuers can escalate fast, and two withdrawers can drift apart quietly."
};
const REG={
"High|Adaptive":"Feels things strongly and has real ways back down.",
"High|Mixed":"Feels things strongly; the ways back work some of the time.",
"High|Still building":"Floods easily and doesn't yet have reliable ways back. This is the place to start.",
"Moderate|Adaptive":"Reacts in proportion and usually recovers well.",
"Moderate|Mixed":"Reacts in proportion; recovery is inconsistent.",
"Moderate|Still building":"Reactions are manageable, but the ways back are thin.",
"Low|Adaptive":"Stays steady and has real ways to regulate.",
"Low|Mixed":"Low reactivity with uneven regulation can mean shutting down rather than staying calm. Worth a closer look.",
"Low|Still building":"Low reported reactivity with few ways to regulate often means numbing or shutting down rather than calm. Worth a closer look."
};
const CH={"Ready":"Ready to work on their own side of the pattern.","Considering":"Open to change and still weighing it.","Not yet":"For now, mostly sees the problem as outside themselves."};
const INS={"Strong":"Sees their own part clearly.","Developing":"Sees some of their own part.","Emerging":"Their own part is harder to see right now."};
const RSP={"Regard":"Holds their partner in regard, even in conflict.","Mixed":"Respect mostly holds, with some sharp or dismissive moments.","Contempt present":"Contempt is showing up. It's the pattern most worth addressing first."};
const CON={"Strong":"Reliable follow-through. Worth checking whether they're carrying more than their share.","Moderate":"Follows through on much of it; some things slip.","Lower":"Things slip often. This is frequently about executive function, not caring, and it responds well to external supports."};
const CTL={"Overcontrolled":"Leans overcontrolled: holds feelings in, likes structure, can be rule-bound. Rigidity and quiet loneliness are bigger risks than outbursts.","Undercontrolled":"Leans undercontrolled: expressive and quick to act on feelings. Pausing before acting is the growth edge.","Flexible":"Flexible: can hold back or let go depending on the moment.","Swings":"Holds a lot in, then lets it out all at once. The buildup is the place to work."};
const PCW={O:"Overcontrolled",U:"Undercontrolled",S:"Swings",F:"Flexible"};
function score(a){let t=0,m=0,re=0,rg=0,ch=0,ins=0,rs=0,cs=0,oc=0,uc=0,pg,sg,pr,pf,pc,cm;QS.forEach((q,i)=>{const v=a[i];if(q[0]==="d"&&v==="a")t++;if(q[0]==="b"&&v==="a")m++;if(q[0]==="r")re+=v;if(q[0]==="g"||q[0]==="gr")rg+=v;if(q[0]==="cm")cm=v;if(q[0]==="x")rg+=3-v;if(q[0]==="c")ch+=v;if(q[0]==="cx")ch+=3-v;if(q[0]==="s"&&v===q[4])ins++;if(q[0]==="rp")rs+=v;if(q[0]==="rn")rs+=3-v;if(q[0]==="cp")cs+=v;if(q[0]==="cn")cs+=3-v;if(q[0]==="pg")pg=v;if(q[0]==="sg")sg=v;if(q[0]==="pr")pr=v;if(q[0]==="pf")pf=v;if(q[0]==="oc")oc+=v;if(q[0]==="uc")uc+=v;if(q[0]==="pc")pc=v;});
const k=(m>=3?"i":"e")+(t>=3?"p":"w");const leans=[];if(t===2||t===3)leans.push("close to the middle on toward/away");if(m===2||m===3)leans.push("close to the middle on me/you");
const reLevel=re>=9?"High":re>=5?"Moderate":"Low";const rgLevel=rg>=11?"Adaptive":rg>=6?"Mixed":"Still building";
const chLevel=ch>=9?"Ready":ch>=5?"Considering":"Not yet";const ctl=oc-uc;const ctLv=(oc>=8&&uc>=8)?"Swings":ctl>=4?"Overcontrolled":ctl<=-4?"Undercontrolled":"Flexible";
return {cm,pg,sg,pr,pf,pc,rs,cs,oc,uc,ctl,ctLv,ch,ins,chLevel,k,lean:leans.length?"Leans: "+leans.join(", "):"Clear on both axes",re,rg,reLevel,rgLevel};}

const enc=o=>{try{return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}catch(e){return "";}};
const dec=s=>{try{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return JSON.parse(decodeURIComponent(escape(atob(s))));}catch(e){return null;}};

export function decodeShared(str){const d=dec(str);if(d&&Array.isArray(d.a)&&d.a.length===QS.length)return {n1:String(d.n1||""),n2:String(d.n2||""),a:d.a};return null;}
export function initialState(){return {step:0,n1:"",n2:"",a1:Array(QS.length).fill(null),a2:Array(QS.length).fill(null),err:false,sel:"r",qi:0,consent:false,cerr:false,email:"",fromLink:false};}
export function buildView(s,update,toolUrl){
const p1=s.n1.trim()||"Partner 1";const p2=s.n2.trim()||"Partner 2";
const quiz=s.step===1||s.step===2;const key=s.step===2?"a2":"a1";const ans=s[key];
const set=(i,v)=>()=>{const n=s[key].slice();n[i]=v;update({[key]:n,err:false,qi:Math.min(i+1,QS.length-1)});};
const qs=QS.map((q,i)=>{const two=q[0]==="d"||q[0]==="b"||q[0]==="s";const sc=["c","cx","rp","rn","oc","uc"].includes(q[0])?AGREE:FREQ;const vals=two?[["a",q[2]],["b",q[3]]]:q[0]==="pg"||q[0]==="sg"?GUESS:q[0]==="pr"?PREG:q[0]==="cm"?CMT:q[0]==="pc"?PCTL:sc.map((f,j)=>[j,f]);const h=HEADS[i];
return {num:i+1,prompt:q[1],head:!!h,headTitle:h?h[0]:"",headHint:h?h[1]:"",opts:vals.map(([v,l])=>({label:l,on:ans[i]===v?"true":"false",style:OPT(ans[i]===v,two),pick:set(i,v)}))};});
const done=ans.filter(x=>x!==null).length;
const qi=s.qi||0;const cq=qs[qi];let sh=["",""];for(let j=qi;j>=0;j--){if(HEADS[j]){sh=HEADS[j];break;}}
const cqOpts=cq.opts.map(o=>Object.assign({},o,{style:o.style.replace(/flex: [^;]+;/,"flex: 0 0 auto;").replace("text-align: center","text-align: left")}));
const dotC=s.step===2?"#c4877e":"#9fb3b0";
let rs=[],resItem=null,me1=null,me2=null;
if(s.step===3){const x=score(s.a1),y=score(s.a2);
const acc=(g,k)=>(g==="xw"||k==="xw")?(g&&g[1]===k[1]?2:0):g===k?2:(g&&(g[0]===k[0]||g[1]===k[1]))?1:0;
const WORD=["missed","partly","exactly"];
[[x,y],[y,x]].forEach(([me,o])=>{me.read=acc(me.pg,o.k);me.seen=acc(me.sg,o.pg);me.ins+=me.read+me.seen;me.rg2=me.rs+o.pr*4;me.cs2=me.cs+o.pf*4;me.rgLv=me.rg2>=18?"Regard":me.rg2>=10?"Mixed":"Contempt present";me.csLv=me.cs2>=18?"Strong":me.cs2>=10?"Moderate":"Lower";me.respect=RSP[me.rgLv]+(me.rs>=9&&o.pr<=1?" Their partner experiences less respect than they report giving.":"");me.control=CTL[me.ctLv]+(PCW[o.pc]&&PCW[o.pc]!==me.ctLv?" Their partner sees them as "+PCW[o.pc].toLowerCase()+".":"");me.follow=CON[me.csLv]+(me.cs>=9&&o.pf<=1?" Their partner sees less follow-through than they do.":"");me.inLevel=me.ins>=7?"Strong":me.ins>=4?"Developing":"Emerging";me.inDetail="Read their partner's pattern: "+WORD[me.read]+". Predicted how they come across: "+WORD[me.seen]+".";});
const card=k=>"flex: 1 1 340px; display: flex; flex-direction: column; gap: 4px; padding: 20px 24px; border-radius: 16px; background: rgba("+COL[k]+",1); color: #0b2545";
const bar=(v,mx)=>"display: block; height: 100%; border-radius: 9999px; background: #0b2545; width: "+Math.round(v/(mx||12)*100)+"%";
rs=[[p1,x],[p2,y]].map(([n,r])=>({name:n,label:QN[r.k],lean:r.lean,card:card(r.k),reLevel:r.reLevel,rgLevel:r.rgLevel,band:"background: rgba("+COL[r.k]+",1); padding: 20px 24px; display: flex; flex-direction: column; gap: 4px; color: #0b2545",reBar:bar(r.re),rgBar:bar(r.rg,15),reg:REG[r.reLevel+"|"+r.rgLevel],chLevel:r.chLevel,inLevel:r.inLevel,chBar:bar(r.ch),inBar:bar(r.ins,9),ready:CH[r.chLevel]+" "+INS[r.inLevel],inDetail:r.inDetail,rgLv:r.rgLv,csLv:r.csLv,rpBar:bar(r.rg2,24),csBar:bar(r.cs2,24),respect:r.respect,follow:r.follow,ctLv:r.ctLv,control:r.control,ctMark:"position: absolute; top: -3px; width: 16px; height: 16px; border-radius: 9999px; background: #0b2545; border: 2px solid #f3f3f3; box-sizing: border-box; left: calc("+Math.round((r.ctl+12)/24*100)+"% - 8px)"}));
const roles={};roles[x.k]=p1;roles[y.k]=roles[y.k]?roles[y.k]+" and "+p2:p2;
const dd=x.k[1]!==y.k[1],bd=x.k[0]!==y.k[0];
let note=dd&&bd?PAIR.diag:dd?(x.k[0]==="i"?PAIR.distMe:PAIR.distYou):bd?PAIR.blame:PAIR.same;
if(x.reLevel==="High"&&y.reLevel==="High")note+=" You both run hot, so agree on a break signal before the next fight, and on when you'll come back.";
else if((x.reLevel==="High"&&y.reLevel==="Low")||(x.reLevel==="Low"&&y.reLevel==="High"))note+=" One of you runs hot and one stays flat, which tends to feed the reach-and-retreat cycle.";
if(x.rgLevel==="Still building"||y.rgLevel==="Still building")note+=" Building ways to self-regulate comes before working on the pattern itself.";
if(x.rgLv==="Contempt present"||y.rgLv==="Contempt present")note+=" Contempt showed up in your answers. It's the pattern to address before anything else.";
if(x.cm<=1||y.cm<=1)note+=" At least one of you is unsure about staying. That's worth naming with a therapist before working on the pattern; discernment counseling is built for exactly this.";
const ov=k=>k==="Overcontrolled",un=k=>k==="Undercontrolled";
if(ov(x.ctLv)&&ov(y.ctLv))note+=" You both tend to hold things in, so problems can go unspoken for a long time.";
else if(un(x.ctLv)&&un(y.ctLv))note+=" You both express fast; agreed pauses will do a lot of work for you.";
else if((ov(x.ctLv)&&un(y.ctLv))||(un(x.ctLv)&&ov(y.ctLv)))note+=" One of you holds in and one lets out. That can polarize: the more one erupts, the tighter the other clamps down.";
if(Math.abs(x.cs2-y.cs2)>=8)note+=" Your follow-through scores are far apart, which often means one of you is overfunctioning and the other underfunctioning. See the overfunctioner / underfunctioner lens.";
if(x.chLevel!==y.chLevel&&(x.chLevel==="Not yet"||y.chLevel==="Not yet"))note+=" One of you is readier to change than the other. That's common, and the readier partner's changes still shift the pattern.";
else if(x.chLevel==="Not yet"&&y.chLevel==="Not yet")note+=" Neither of you sounds ready to change yet. Starting with what each of you wants from the relationship may help more than skill-building.";
resItem=["Your map",roles,note,"Pick another lens to compare"];me1=[p1,x.k];me2=[p2,y.k];}
let cur=resItem||DATA[0][1][0];
const groups=[];
if(resItem)groups.push({label:"You two",items:[{name:"Your map",style:s.sel==="r"?CHIP_ON:CHIP_OFF,pick:()=>update({sel:"r"})}]});
DATA.forEach((g,gi)=>groups.push({label:g[0],items:g[1].map((f,fi)=>{const id=gi+"-"+fi;if(id===s.sel)cur=f;return {name:f[0],style:id===s.sel?CHIP_ON:CHIP_OFF,pick:()=>update({sel:id})};})}));
const isLens=!!resItem&&s.sel!=="r";
const whoIn=k=>resItem?[me1,me2].filter(m=>m[1]===k).map(m=>m[0]).join(" and "):"";
const cell=k=>{const who=whoIn(k);const role=resItem&&s.sel==="r"?"":(cur[1][k]||"");const on=!!who||!!role;return {who,role,hasWho:!!who,hasRole:!!role,on,style:CELL(k,on)};};
let out=cur[3]||"";
if(isLens){const said=[me1,me2].map(m=>m[0]+": "+(cur[1][m[1]]||"not named by this lens"));out="Through this lens, "+said.join("; ");}
const shareLink=toolUrl+"#p1="+enc({n1:s.n1,n2:s.n2,a:s.a1});
const mailBody="Hi "+p2+",\n\nI just finished my part of the Olive Clinical Couples Classification Interactive Tool. Open this link to take your part. Our results will show when you're done, so let's look at them together.\n\n"+shareLink+"\n\nHeads up: my answers are included in this link.\n\n"+p1;
const mailto="mailto:"+encodeURIComponent(s.email.trim())+"?subject="+encodeURIComponent("Your turn: Couples Classification Interactive Tool")+"&body="+encodeURIComponent(mailBody);
return {s0:s.step===0,quiz,s3:s.step===3,sH:s.step===1.5,fromLink:!!s.fromLink,consent:!!s.consent,noConsent:!s.consent,cerr:!!s.cerr,email:s.email,shareLink,mailto,
passDevice:()=>update({step:2,qi:0,err:false}),toggleConsent:e=>update({consent:!!e.target.checked,cerr:false}),setEmail:e=>update({email:e.target.value}),consentErr:()=>update({cerr:true}),
n1:s.n1,n2:s.n2,p1,
setN1:e=>update({n1:e.target.value}),setN2:e=>update({n2:e.target.value}),
start:()=>update({step:1,err:false,qi:0}),
who:{name:s.step===2?p2:p1,dot:"display: inline-block; width: 18px; height: 18px; border-radius: 9999px; vertical-align: middle; background: "+dotC},
qs,cq:Object.assign({},cq,{opts:cqOpts}),section:{title:sh[0],hint:sh[1]},progress:"height: 100%; border-radius: 9999px; background: #7a4f6e; width: "+Math.round(done/QS.length*100)+"%",allDone:done===QS.length,canSkipAhead:ans[qi]!==null&&qi<QS.length-1,fwdQ:()=>update({qi:Math.min(qi+1,QS.length-1)}),prevQ:()=>{if(qi>0)update({qi:qi-1});else if(!s.fromLink)update({step:s.step===2?1.5:0,err:false,qi:0});},done,total:QS.length,err:s.err,nextLabel:s.step===1?"I'm done":"See our map",
next:()=>{if(done<QS.length){update({err:true});return;}update({step:s.step===1?1.5:3,err:false,sel:"r",qi:0});},
back:()=>update({step:s.step-1,err:false}),
retake:()=>update({step:0,a1:Array(50).fill(null),a2:Array(50).fill(null),sel:"r",qi:0,consent:false,cerr:false,email:"",fromLink:false}),
rs,groups,name:cur[0],note:cur[2],out,cite:(CITE[cur[0]]||"").replace(/&amp;/g,"&"),hasCite:!!CITE[cur[0]],ip:cell("ip"),iw:cell("iw"),ep:cell("ep"),ew:cell("ew")};
}
