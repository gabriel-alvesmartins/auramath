import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/index.js';

test('Scaffolding Integrity: All 32 nodes have at least 3 valid, matched scaffolding tasks', () => {
  const grades = engine.TRACK_GRADES;
  let totalTasksChecked = 0;

  for (const g of grades) {
    for (const node of g.nodes) {
      const tasks = engine.getNodeScaffoldingTasks(node.id);

      assert.ok(
        tasks && tasks.length >= 3,
        `Node ${node.id} must have at least 3 scaffolding tasks (got ${tasks?.length})`
      );

      tasks.forEach((task, taskIdx) => {
        totalTasksChecked++;
        assert.ok(task.equation, `Task ${taskIdx} in ${node.id} must have an equation`);
        assert.ok(task.instruction, `Task ${taskIdx} in ${node.id} must have an instruction`);
        assert.ok(task.template, `Task ${taskIdx} in ${node.id} must have a template`);
        assert.ok(
          Array.isArray(task.blanks) && task.blanks.length > 0,
          `Task ${taskIdx} in ${node.id} must have blanks`
        );

        // Find all {placeholder} in template
        const templateKeys = (task.template.match(/\{([^\}]+)\}/g) || []).map((k) => k.slice(1, -1));
        const blankKeys = task.blanks.map((b) => b.key);

        // Ensure every placeholder has a matching blank
        for (const tk of templateKeys) {
          assert.ok(
            blankKeys.includes(tk),
            `Node ${node.id} Task ${taskIdx}: Template placeholder {${tk}} not found in blanks [${blankKeys.join(', ')}]`
          );
        }

        // Ensure every blank has a placeholder in template
        for (const bk of blankKeys) {
          assert.ok(
            templateKeys.includes(bk),
            `Node ${node.id} Task ${taskIdx}: Blank key "${bk}" not found in template "${task.template}"`
          );
        }

        // Validate expected value is present
        for (const b of task.blanks) {
          assert.ok(
            typeof b.expected === 'string' && b.expected.length > 0,
            `Node ${node.id} Task ${taskIdx}: Blank "${b.key}" expected value must be non-empty string`
          );
        }
      });
    }
  }

  assert.ok(totalTasksChecked >= 32 * 3, `Expected at least 96 tasks, checked ${totalTasksChecked}`);
});
