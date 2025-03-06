import loader from "@monaco-editor/loader";

import "monaco-editor/esm/vs/editor/editor.all.js";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution";
import "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution";

import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { GoTemplateLanguage, TOMLLanguage } from "./languages";

self.MonacoEnvironment = {
	getWorker(_workerId, label) {
		if (label === "json") {
			return new JSONWorker();
		}
		return new EditorWorker();
	},
};

// https://www.npmjs.com/package/@monaco-editor/react#use-monaco-editor-as-an-npm-package
loader.config({ monaco });

loader
	.init()
	.then((monacoInstance) => {
		const goTemplateLanguage = new GoTemplateLanguage();
		const tomlLanguage = new TOMLLanguage();
		for (const language of [goTemplateLanguage, tomlLanguage]) {
			language.register(monacoInstance);
		}
	})
	.catch((error) => {
		console.error("Error initializing Monaco Editor", error);
	});
