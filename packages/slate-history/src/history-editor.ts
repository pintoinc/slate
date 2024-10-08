import { BaseEditor, Editor } from 'slate'
import { History } from './history'

/**
 * Weakmaps for attaching state to the editor.
 */

export const HISTORY = new WeakMap<Editor, History>()
export const SAVING = new WeakMap<Editor, boolean | undefined>()
export const MERGING = new WeakMap<Editor, boolean | undefined>()

/**
 * `HistoryEditor` contains helpers for history-enabled editors.
 */

export interface HistoryEditor extends BaseEditor {
  history: History
  undo: () => void
  redo: () => void
  writeHistory: (stack: 'undos' | 'redos', batch: any) => void
}

// eslint-disable-next-line no-redeclare
export const HistoryEditor = {
  /**
   * Check if a value is a `HistoryEditor` object.
   */

  isHistoryEditor(value: any): value is HistoryEditor {
    return History.isHistory(value.history) && Editor.isEditor(value)
  },

  /**
   * Get the merge flag's current value.
   */

  isMerging(editor: HistoryEditor): boolean | undefined {
    return MERGING.get(editor)
  },

  /**
   * Get the saving flag's current value.
   */

  isSaving(editor: HistoryEditor): boolean | undefined {
    return SAVING.get(editor)
  },

  /**
   * Redo to the previous saved state.
   */

  redo(editor: HistoryEditor): void {
    editor.redo()
  },

  /**
   * Undo to the previous saved state.
   */

  undo(editor: HistoryEditor): void {
    editor.undo()
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, These operations will
   * be merged into the previous history.
   */
  withMerging(editor: HistoryEditor, fn: () => void): void {
    const prev = HistoryEditor.isMerging(editor)
    MERGING.set(editor, true)
    fn()
    MERGING.set(editor, prev)
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */

  withoutMerging(editor: HistoryEditor, fn: () => void): void {
    const prev = HistoryEditor.isMerging(editor)
    MERGING.set(editor, false)
    fn()
    MERGING.set(editor, prev)
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */

  withoutSaving(editor: HistoryEditor, fn: () => void): void {
    const prev = HistoryEditor.isSaving(editor)
    SAVING.set(editor, false)
    fn()
    SAVING.set(editor, prev)
  },
}
