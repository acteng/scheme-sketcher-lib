<script lang="ts">
  import icon from "$lib/assets/warning.svg";

  export let text: string;
</script>

<img src={icon} title={text} alt={text} />
