import {
	codeEditorDataLanguages,
	CodeEditorKind,
	codeEditorOutputLanguages,
	codeEditorTemplateLanguages,
	CodeLanguages,
	createLanguageChoices,
	type CodeLanguage,
} from "@lib/monaco-editor/languages";
import type { EditorProps } from "@monaco-editor/react";
import { Uri } from "monaco-editor/esm/vs/editor/editor.api";
import type { IQuickPickItem } from "monaco-editor/esm/vs/platform/quickinput/common/quickInput";

interface TextModelLanguage extends Playground.CodeLanguageMetadata {
	id: CodeLanguage;
}

export type TextModelPath = `inmemory://playground/${string}`;

export interface TextModelFile extends Pick<EditorProps, "defaultValue"> {
	/** Display name of the file */
	label: string;
	/** URI of the file */
	path: TextModelPath;
	defaultLanguage: TextModelLanguage;
	languageChoices?: IQuickPickItem[];
	readOnly?: boolean;
}

export const textModelOutputFile = {
	label: "Output",
	path: "inmemory://playground/playground.output",
	defaultLanguage: {
		...codeEditorOutputLanguages.plaintext,
		id: CodeLanguages.Plaintext,
	},
	languageChoices: createLanguageChoices({
		editorKind: CodeEditorKind.Output,
	}),
	readOnly: true,
	defaultValue: `Loading...`, // Placeholder value
} as const satisfies TextModelFile;

export const textModelTemplateFile = {
	label: "Template",
	path: "inmemory://playground/playground.go.tpl",
	defaultLanguage: {
		...codeEditorTemplateLanguages.gotemplate,
		id: CodeLanguages.GoTemplate,
	},
	languageChoices: undefined, // No quick pick for template
	defaultValue: `# Project: {{.ProjectName}}
**Description:** {{.Description}}

## Team Members
{{- range .TeamMembers}}
- **{{.Name}}** ({{.Role}})
{{- end}}

## Tasks
{{- range .Tasks}}
- **{{.Title}}** ({{.Status}})
  - Assigned to: {{.AssignedTo}}
  - Due Date: {{.DueDate}}
  - Dependencies: {{.Dependencies}}
{{end}}

## Milestones
{{- range .Milestones}}
- **{{.Title}}** (Due: {{.DueDate}})
  - Status: {{.Status}}
  - Deliverables: {{.Deliverables}}
{{end}}`,
} as const satisfies TextModelFile;

export const textModelDataFile = {
	label: "Data",
	path: "inmemory://playground/playground.data",
	defaultLanguage: {
		...codeEditorDataLanguages.json,
		id: CodeLanguages.JSON,
	},
	languageChoices: createLanguageChoices({
		editorKind: CodeEditorKind.Context,
	}),
	defaultValue: `{
  "ProjectName": "Microservices Architecture Implementation",
  "Description": "A project to implement a microservices architecture to improve scalability and maintainability.",
  "TeamMembers": [
    {
      "Name": "Alice",
      "Role": "Technical Lead"
    },
    {
      "Name": "Bob",
      "Role": "Backend Developer"
    },
    {
      "Name": "Charlie",
      "Role": "Frontend Developer"
    },
    {
      "Name": "Dave",
      "Role": "DevOps Engineer"
    }
  ],
  "Tasks": [
    {
      "Title": "Design microservices architecture",
      "Status": "In Progress",
      "AssignedTo": "Alice",
      "DueDate": "2023-10-15",
      "Dependencies": "None"
    },
    {
      "Title": "Develop authentication service",
      "Status": "Not Started",
      "AssignedTo": "Bob",
      "DueDate": "2023-10-20",
      "Dependencies": "Design microservices architecture"
    },
    {
      "Title": "Implement CI/CD pipeline",
      "Status": "Pending",
      "AssignedTo": "Dave",
      "DueDate": "2023-10-25",
      "Dependencies": "Develop authentication service"
    },
    {
      "Title": "Create frontend for user management",
      "Status": "Pending",
      "AssignedTo": "Charlie",
      "DueDate": "2023-10-30",
      "Dependencies": "Develop authentication service"
    }
  ],
  "Milestones": [
    {
      "Title": "Architecture design completed",
      "DueDate": "2023-10-15",
      "Status": "In Progress",
      "Deliverables": "Architecture design document"
    },
    {
      "Title": "Authentication service developed",
      "DueDate": "2023-10-20",
      "Status": "Not Started",
      "Deliverables": "Authentication service codebase"
    },
    {
      "Title": "CI/CD pipeline implemented",
      "DueDate": "2023-10-25",
      "Status": "Pending",
      "Deliverables": "CI/CD pipeline scripts"
    },
    {
      "Title": "User management frontend created",
      "DueDate": "2023-10-30",
      "Status": "Pending",
      "Deliverables": "User management frontend codebase"
    }
  ]
}`,
} as const satisfies TextModelFile;

export const textModelFiles = [
	textModelTemplateFile,
	textModelDataFile,
	textModelOutputFile,
] as const satisfies TextModelFile[];

/** Mapping of file {@link Uri URIs} to {@link TextModelFile} */
export const textModelFilesByUri: ReadonlyMap<string, TextModelFile> = new Map(
	textModelFiles.map((f) => [Uri.parse(f.path).toString(), f]),
);

export const TOTAL_TEXT_MODEL_FILES = textModelFiles.length;

export function filenameFromUri({
	uri,
	suffixFn,
}: {
	uri: Uri;
	suffixFn?: (props: { hasExtension: boolean }) => string;
}) {
	const lastSegment = uri.path.split("/").pop() ?? "";
	return suffixFn
		? lastSegment + suffixFn({ hasExtension: lastSegment.includes(".") })
		: lastSegment;
}
