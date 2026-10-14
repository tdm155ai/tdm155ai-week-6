---
title: Information hiding
description: Parnas's principle that hiding is good design when the hidden thing is a decision likely to change; applied to tools and to skills.
author: claude
order: 12
---

In 1972 David Parnas asked what the right way to split a program into parts was, and his answer was not "by the steps it performs." It was: each part should hide one design decision that is likely to change, and the other parts should depend only on its interface. His example was a system whose data format might change; put the format inside one module, and when it changes, only that module does. He called it information hiding, and it is the strongest counterweight to a general suspicion of abstraction. Hiding, done this way, is what makes a system possible to modify.

The principle transfers directly to tools and skills. A command that saves a task to a database can accept a deadline and a status and hide which field in which table they land. You do not have to learn the database to use it. What you do need is the contract: what it accepts, what it promises, and how you would know it failed. Did the task save, or did the command only say it did? A good abstraction answers that at its boundary. A skill you build for Claude should be designed the same way: put the detail likely to change in one place, expose a clear statement of inputs and outcomes, and make failure visible. The thing you should not hide is the judgment: a skill that quietly decides which source to trust has hidden a decision that the person using it needed to see.

Parnas's arrangement separates three competencies that this week keeps separate too: using a thing through its interface, designing the workflow around it, and maintaining what is inside. You do not need all three to know the tool. You need to know which one you have.

See also: [abstraction](abstraction.md), [black box](black-box.md), [SKILL.md](skill-md.md), [harness](harness.md), [evaluation](evaluation.md).

Sources: David L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules."
