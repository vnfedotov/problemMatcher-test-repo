import * as vscode from 'vscode';
import { TestView } from './testView';

export function activate(context: vscode.ExtensionContext) {
    new TestView(context);
}

export function deactivate() {
}

