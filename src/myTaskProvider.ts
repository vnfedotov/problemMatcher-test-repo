import * as vscode from 'vscode';

export interface MyTaskDefinition extends vscode.TaskDefinition {
    type: string;
    taskType: string;
	label: string;
	script: string;
	options?: string[];
}

export class MyTaskProvider implements vscode.TaskProvider {
	static providerType = "my-task";
	private taskDefinitions: MyTaskDefinition[] = undefined;

	constructor(taskDefinitions: MyTaskDefinition[]) {
		this.taskDefinitions = taskDefinitions;
	}

	public provideTasks(): vscode.Task[] {
		return this.taskDefinitions.map(definition => this.taskByDefinition(definition));
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		return undefined;
	}

	public taskByDefinition(taskDefinition: MyTaskDefinition): vscode.Task {
		return new vscode.Task(
			taskDefinition,
			vscode.workspace.workspaceFolders[0],
			taskDefinition.label,
			'my-task',
			new vscode.ProcessExecution(
				'/bin/bash',
				taskDefinition.options ? [taskDefinition.script].concat(taskDefinition.options) : [taskDefinition.script]
			),
			[
				'$my-task'
			]);
	}
}
