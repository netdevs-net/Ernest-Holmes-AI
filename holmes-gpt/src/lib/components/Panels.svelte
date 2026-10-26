<script lang="ts">
  import { ui } from "$lib/state/ui.svelte";
  import AdminMenu from "./AdminMenu.svelte";
  import Dialog from "./Dialog.svelte";
  import HistoryPanel from "./HistoryPanel.svelte";
  import QuotesPanel from "./QuotesPanel.svelte";
  import SharePanel from "./SharePanel.svelte";
  import TreatmentPanel from "./TreatmentPanel.svelte";
</script>

<svelte:window
  onkeydown={(event) => {
    // Command-K (Ctrl-K on Windows and Linux) opens or closes the admin menu.
    if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      ui.toggleAdmin();
    }
  }}
/>

<Dialog
  open={ui.panel === "admin"}
  title="Admin"
  description="Press Command-K (Ctrl-K) again to close"
  onclose={() => ui.panel === "admin" && ui.close()}
>
  <AdminMenu />
</Dialog>

<Dialog
  open={ui.panel === "history"}
  title="Your questions"
  description="Saved on this browser session"
  size="lg"
  onclose={() => ui.panel === "history" && ui.close()}
>
  <HistoryPanel />
</Dialog>

<Dialog
  open={ui.panel === "quotes"}
  title="Words from Ernest Holmes"
  onclose={() => ui.panel === "quotes" && ui.close()}
>
  <QuotesPanel />
</Dialog>

<Dialog
  open={ui.panel === "treatment"}
  title="Mind treatment"
  description="A five-part spiritual treatment in the Science of Mind form"
  size="lg"
  onclose={() => ui.panel === "treatment" && ui.close()}
>
  <TreatmentPanel />
</Dialog>

<Dialog
  open={ui.panel === "share"}
  title="Share by email"
  onclose={() => ui.panel === "share" && ui.close()}
>
  <SharePanel />
</Dialog>
