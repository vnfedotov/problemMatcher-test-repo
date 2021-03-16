import * as vscode from 'vscode';
import { MyTaskProvider, MyTaskDefinition } from './myTaskProvider';

const taskDefinitions: MyTaskDefinition[] = [
    {
        type: "my-task",
        label: "test",
        script: "task.sh",
        taskType: "my-task"
    }
];

let taskProvider: MyTaskProvider = undefined;

export class TestView {
    constructor(context: vscode.ExtensionContext) {
        const dataProvider = new TestTasksDataProvider();
        taskProvider = new MyTaskProvider(taskDefinitions);
        const view = vscode.window.createTreeView('testView', { treeDataProvider: dataProvider, showCollapseAll: true });

        context.subscriptions.push(
            vscode.commands.registerCommand('testView.runTask', dataProvider.runTask, dataProvider),
            vscode.tasks.registerTaskProvider(MyTaskProvider.providerType, taskProvider)
        );
    }
}

class TestTaskItem extends vscode.TreeItem {
    children: TestTaskItem[];
    taskDefinition: MyTaskDefinition;

    constructor(properties?: {
        label: string;
        description?: string;
        tooltip?: string;
        iconPath?: string;
        collapsibleState?: vscode.TreeItemCollapsibleState;
        command?: vscode.Command;
        contextValue?: string;
        taskDefinition?: MyTaskDefinition;
        children?: TestTaskItem[];
    }) {
        if (properties) {
            super(properties.label, properties.collapsibleState);
            Object.assign(this, properties);
        }
        else {
            super("none", vscode.TreeItemCollapsibleState.None);
        }
    }

    getChildren(id?: string): TestTaskItem[] {
        return this.children;
    }
}

class TestTasksDataProvider implements vscode.TreeDataProvider<TestTaskItem> {

    private viewItems = new TestTaskItem({
        label: "root",
        children:
            taskDefinitions.map(definition => this.mapDefinition(definition))
    });

    getChildren(item?: TestTaskItem): TestTaskItem[] {
        if (item) {
            return item.children;
        }
        else {
            return this.viewItems.children;
        }
    };

    getTreeItem(item: TestTaskItem): vscode.TreeItem {
        return item;
    };

    private mapDefinition(definition: MyTaskDefinition): TestTaskItem {
        const item = new TestTaskItem({
            label: definition.label,
            contextValue: "myTaskItem",
            taskDefinition: definition
        });

        item.command = {
            title: "run test task",
            command: "testView.runTask",
            arguments: [item],
        };

        return item;
    }

    runTask(item: TestTaskItem) {
        vscode.window.showInformationMessage(`Running ${item.label}`);
        const taskToRun = taskProvider.taskByDefinition(item.taskDefinition);
        const task = vscode.tasks.executeTask(taskToRun);
    }
}
