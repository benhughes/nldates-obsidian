import { App, PluginSettingTab, Setting } from "obsidian";
import NaturalLanguageDates from "./main";

export interface NLDSettings {
  autocompleteTriggerPhrase: string;
  isAutosuggestEnabled: boolean;

  format: string;
  timeFormat: string;
  separator: string;
  weekStart: string;

  modalToggleTime: boolean;
  modalToggleLink: boolean;
  modalMomentFormat: string;
}

export const DEFAULT_SETTINGS: NLDSettings = {
  autocompleteTriggerPhrase: "@",
  isAutosuggestEnabled: true,

  format: "YYYY-MM-DD",
  timeFormat: "HH:mm",
  separator: " ",
  weekStart: "Monday",

  modalToggleTime: false,
  modalToggleLink: false,
  modalMomentFormat: "YYYY-MM-DD HH:mm",
};

export class NLDSettingsTab extends PluginSettingTab {
  plugin: NaturalLanguageDates;

  constructor(app: App, plugin: NaturalLanguageDates) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", {
      text: "Nldates settings",
    });

    containerEl.createEl("h3", {
      text: "Parser settings",
    });

    new Setting(containerEl)
      .setName("Date format")
      .setDesc("Output format for parsed dates")
      .addMomentFormat((text) =>
        text
          .setDefaultFormat("YYYY-MM-DD")
          .setValue(this.plugin.settings.format)
          .onChange(async (value) => {
            if (value === "") {
              this.plugin.settings.format = "YYYY-MM-DD";
            } else {
              this.plugin.settings.format = value.trim();
            }
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Week starts on")
      .setDesc("Which day to consider as the start of the week")
      .addDropdown((day) =>
        day
          .addOption("Monday", "Monday")
          .addOption("Sunday", "Sunday")
          .setValue(this.plugin.settings.weekStart)
          .onChange(async (value) => {
            this.plugin.settings.weekStart = value.trim();
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", {
      text: "Hotkey formatting settings",
    });

    new Setting(containerEl)
      .setName("Time format")
      .setDesc("Format for the hotkeys that include the current time")
      .addMomentFormat((text) =>
        text
          .setDefaultFormat("HH:mm")
          .setValue(this.plugin.settings.timeFormat)
          .onChange(async (value) => {
            if (value === "") {
              this.plugin.settings.timeFormat = "HH:mm";
            } else {
              this.plugin.settings.timeFormat = value.trim();
            }
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Separator")
      .setDesc("Separator between date and time for entries that have both")
      .addText((text) =>
        text
          .setPlaceholder("Separator is empty")
          .setValue(this.plugin.settings.separator)
          .onChange(async (value) => {
            this.plugin.settings.separator = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", {
      text: "Date Autosuggest",
    });

    new Setting(containerEl)
      .setName("Enable date autosuggest")
      .setDesc(
        `Input dates with natural language. Open the suggest menu with ${this.plugin.settings.autocompleteTriggerPhrase}`
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.isAutosuggestEnabled)
          .onChange(async (value) => {
            this.plugin.settings.isAutosuggestEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Trigger phrase")
      .setDesc("Character(s) that will cause the date autosuggest to open")
      .addMomentFormat((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.autocompleteTriggerPhrase)
          .setValue(this.plugin.settings.autocompleteTriggerPhrase || "@")
          .onChange(async (value) => {
            this.plugin.settings.autocompleteTriggerPhrase = value.trim();
            await this.plugin.saveSettings();
          })
      );
  }
}
