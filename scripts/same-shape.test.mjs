import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = ts.createSourceFile('vite.config.ts', readFileSync('vite.config.ts', 'utf8'),
  ts.ScriptTarget.Latest, true);
const declaration = source.statements.find((statement) =>
  ts.isFunctionDeclaration(statement) && statement.name?.text === 'sameShape');
assert.ok(declaration, 'site content validation function is present');
const sameShape = runInNewContext(`${ts.transpile(declaration.getText(source))}\nsameShape`);

test('content validation retains string and nested shape limits', () => {
  assert.equal(sameShape('a'.repeat(10000), ''), true);
  assert.equal(sameShape('a'.repeat(10001), ''), false);
  assert.equal(sameShape(42, ''), false);
  assert.equal(sameShape({ title: 'hello', items: ['one'] }, { title: '', items: [''] }), true);
  assert.equal(sameShape({ title: 42, items: ['one'] }, { title: '', items: [''] }), false);
  assert.equal(sameShape(null, null), true);
});
