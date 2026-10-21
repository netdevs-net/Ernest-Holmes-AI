export type Panel = "history" | "quotes" | "treatment" | "share" | null;

class UiState {
  panel = $state<Panel>(null);
  /** Text of the message being shared by email. */
  shareText = $state("");

  open(panel: Exclude<Panel, null>) {
    this.panel = panel;
  }

  close() {
    this.panel = null;
  }

  share(text: string) {
    this.shareText = text;
    this.panel = "share";
  }
}

export const ui = new UiState();
