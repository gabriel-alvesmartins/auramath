import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

describe('R7: Views Theming Harmony & Mental Math Generators', () => {
  const viewsDir = path.join(ROOT_DIR, 'src', 'views');

  test('F33: All active views contain zero cosmic/neon hardcoded hexes', () => {
    const activeViews = [
      'TrackView.tsx',
      'TrainHubView.tsx',
      'DuelHubView.tsx',
      'LabView.tsx',
      'ProfileHubView.tsx',
      'DuolingoLessonView.tsx',
    ];

    const forbiddenNeonPattern = /#00F2FE|#07090E|#0B0F19|#8A2BE2/i;

    for (const viewName of activeViews) {
      const filePath = path.join(viewsDir, viewName);
      assert.ok(fs.existsSync(filePath), `View ${viewName} must exist`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(forbiddenNeonPattern);
      assert.equal(
        matches,
        null,
        `Active view ${viewName} must not contain forbidden neon/cosmic colors, found: ${matches?.[0]}`
      );
    }
  });

  test('F34: Active views utilize semantic editorial CSS variables', () => {
    const activeViews = [
      'TrackView.tsx',
      'TrainHubView.tsx',
      'DuelHubView.tsx',
      'LabView.tsx',
      'ProfileHubView.tsx',
      'DuolingoLessonView.tsx',
    ];

    for (const viewName of activeViews) {
      const filePath = path.join(viewsDir, viewName);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(
        content.includes('--color-bg-base') || content.includes('--color-bg-surface') || content.includes('--color-paper'),
        `View ${viewName} must reference semantic background variables`
      );
    }
  });

  test('F35: DuolingoLessonView forwards node.id to generateQuestion', () => {
    const lessonViewPath = path.join(viewsDir, 'DuolingoLessonView.tsx');
    const content = fs.readFileSync(lessonViewPath, 'utf-8');
    assert.match(
      content,
      /generateQuestion(sForNode)?\(\s*node\.id/,
      'DuolingoLessonView must pass node.id first to generateQuestion'
    );
  });
});
