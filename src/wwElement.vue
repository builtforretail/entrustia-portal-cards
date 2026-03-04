<template>
  <div class="pp-card-list" :style="containerStyle">
    <div
      v-for="item in processedItems"
      :key="item.id"
      class="pp-card"
      :style="cardStyle"
    >
      <!-- Action Row -->
      <div class="card-actions">
        <button
          class="btn-action btn-edit"
          :style="getEditButtonStyle(item.id)"
          type="button"
          @click="handleEdit(item)"
          @mouseenter="setHover(item.id, 'edit', true)"
          @mouseleave="setHover(item.id, 'edit', false)"
          @mousedown="setActive(item.id, 'edit', true)"
          @mouseup="setActive(item.id, 'edit', false)"
        >
          Edit
        </button>
      </div>

      <!-- Active -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Active</span>
        <span class="field-value">
          <span
            class="status-badge"
            :style="item.is_enabled ? activeBadgeStyle : inactiveBadgeStyle"
          >
            {{ item.is_enabled ? 'Active' : 'Inactive' }}
          </span>
        </span>
      </div>

      <!-- Page Name + Folder Name -->
      <div class="card-field card-field-column">
        <span class="field-label" :style="labelStyle">Page Name</span>
        <span class="field-value page-name-value" :style="valueStyle">{{ item.name }}</span>
        <span class="folder-name-sub" :style="labelStyle">Folder Name: {{ item.folder_name }}</span>
      </div>

      <!-- File Types -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">File Types</span>
        <span class="field-value file-types-value">
          <span
            v-for="badge in item.fileBadges"
            :key="badge"
            class="file-badge"
            :style="fileBadgeStyle"
          >{{ badge }}</span>
          <span v-if="!item.fileBadges.length" :style="valueStyle">—</span>
        </span>
      </div>

      <!-- Max Size -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Max Size</span>
        <span class="field-value" :style="valueStyle">{{ item.maxSizeDisplay }}</span>
      </div>

      <!-- Page Instructions -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Page Instructions</span>
        <span class="field-value">
          <button
            class="btn-action btn-instructions"
            :style="getInstructionsButtonStyle(item.id)"
            type="button"
            @click="handleInstructions(item)"
            @mouseenter="setHover(item.id, 'instructions', true)"
            @mouseleave="setHover(item.id, 'instructions', false)"
            @mousedown="setActive(item.id, 'instructions', true)"
            @mouseup="setActive(item.id, 'instructions', false)"
          >
            Click to Edit
          </button>
        </span>
      </div>

      <!-- Expiry Date -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Expiry Date</span>
        <span class="field-value" :style="valueStyle">{{ item.expiryDisplay }}</span>
      </div>

      <!-- Captcha -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Captcha?</span>
        <span class="field-value checkbox-value">
          <span
            class="checkbox-box"
            :style="item.captcha_required ? checkedBoxStyle : uncheckedBoxStyle"
            aria-hidden="true"
          >
            <svg v-if="item.captcha_required" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </span>
      </div>

      <!-- Share + Link -->
      <div class="card-actions card-actions-bottom">
        <button
          class="btn-action btn-icon"
          :style="getIconButtonStyle(item.id, 'share')"
          type="button"
          title="Share"
          @click="handleShare(item)"
          @mouseenter="setHover(item.id, 'share', true)"
          @mouseleave="setHover(item.id, 'share', false)"
          @mousedown="setActive(item.id, 'share', true)"
          @mouseup="setActive(item.id, 'share', false)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Share
        </button>
        <button
          class="btn-action btn-icon"
          :style="getIconButtonStyle(item.id, 'link')"
          type="button"
          title="Copy Link"
          @click="handleLink(item)"
          @mouseenter="setHover(item.id, 'link', true)"
          @mouseleave="setHover(item.id, 'link', false)"
          @mousedown="setActive(item.id, 'link', true)"
          @mouseup="setActive(item.id, 'link', false)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
          </svg>
          Link
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!processedItems.length" class="empty-state" :style="emptyStateStyle">
      No public pages to display.
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  name: 'PublicPagesCardList',

  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },

  emits: ['trigger-event'],

  setup(props, { emit }) {
    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    const { value: selectedItem, setValue: setSelectedItem } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'selectedItem',
        type: 'object',
        defaultValue: null,
      });

    const { value: itemCount, setValue: setItemCount } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'itemCount',
        type: 'number',
        defaultValue: 0,
      });

    const hoverState = ref({});
    const activeState = ref({});

    const setHover = (id, btn, val) => {
      hoverState.value = { ...hoverState.value, [id + '-' + btn]: val };
    };

    const setActive = (id, btn, val) => {
      activeState.value = { ...activeState.value, [id + '-' + btn]: val };
    };

    const darken = (hex, amount) => {
      const h = (hex || '#2d6a4f').replace('#', '');
      const num = parseInt(h.length === 3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h, 16);
      const r = Math.max(0, (num >> 16) - amount);
      const g = Math.max(0, ((num >> 8) & 0xff) - amount);
      const b = Math.max(0, (num & 0xff) - amount);
      return '#' + [r, g, b].map(function(v) { return v.toString(16).padStart(2, '0'); }).join('');
    };

    const getMimeBadges = (patterns) => {
      if (!Array.isArray(patterns) || !patterns.length) return [];
      const badges = [];
      patterns.forEach(function(p) {
        const val = (p && (p.value || p)) || '';
        if (val === 'application/pdf') badges.push('PDF');
        else if (val === 'image/*') badges.push('Images');
        else if (val === 'application/*') badges.push('Office');
      });
      return badges;
    };

    const formatExpiry = (val) => {
      if (!val) return 'mm/dd/yyyy';
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return 'mm/dd/yyyy';
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
      } catch (e) {
        return 'mm/dd/yyyy';
      }
    };

    const formatMaxBytes = (bytes) => {
      if (!bytes && bytes !== 0) return '—';
      return Math.round(bytes / (1024 * 1024)) + ' MB';
    };

    const processedItems = computed(() => {
      const items = props.content?.data || [];
      const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

      return items.map(function(item) {
        const id = resolveMappingFormula(props.content?.dataIdFormula, item) ?? item?.id;
        const name = resolveMappingFormula(props.content?.dataNameFormula, item) ?? item?.name;
        const folder_name = resolveMappingFormula(props.content?.dataFolderNameFormula, item) ?? item?.folder_name;
        const is_enabled = resolveMappingFormula(props.content?.dataIsEnabledFormula, item) ?? item?.is_enabled;
        const allowed_mime_patterns = resolveMappingFormula(props.content?.dataAllowedMimeFormula, item) ?? item?.allowed_mime_patterns;
        const max_bytes = resolveMappingFormula(props.content?.dataMaxBytesFormula, item) ?? item?.max_bytes;
        const instructions = resolveMappingFormula(props.content?.dataInstructionsFormula, item) ?? item?.instructions;
        const expires_at = resolveMappingFormula(props.content?.dataExpiresAtFormula, item) ?? item?.expires_at;
        const captcha_required = resolveMappingFormula(props.content?.dataCaptchaRequiredFormula, item) ?? item?.captcha_required;

        return {
          ...item,
          id: id ?? 'item-' + Math.random(),
          name: name ?? 'Untitled',
          folder_name: folder_name ?? '',
          is_enabled: Boolean(is_enabled),
          allowed_mime_patterns: allowed_mime_patterns ?? [],
          max_bytes: max_bytes ?? 0,
          instructions: instructions ?? '',
          expires_at: expires_at ?? null,
          captcha_required: Boolean(captcha_required),
          fileBadges: getMimeBadges(allowed_mime_patterns ?? item?.allowed_mime_patterns ?? []),
          maxSizeDisplay: formatMaxBytes(max_bytes ?? item?.max_bytes),
          expiryDisplay: formatExpiry(expires_at ?? item?.expires_at),
          _original: item,
        };
      });
    });

    watch(processedItems, function(items) { setItemCount(items?.length ?? 0); }, { immediate: true });

    const resolvedPrimaryColor = computed(() => props.content?.primaryColor || '#2d6a4f');
    const resolvedOutlineColor = computed(() => props.content?.outlineColor || '#2d6a4f');

    const containerStyle = computed(() => ({
      '--pp-primary': resolvedPrimaryColor.value,
      '--pp-outline': resolvedOutlineColor.value,
      '--pp-card-bg': props.content?.cardBackground || '#ffffff',
      '--pp-card-border': props.content?.cardBorderColor || '#e5e7eb',
      '--pp-card-radius': (props.content?.cardBorderRadius ?? 8) + 'px',
      '--pp-label-color': props.content?.labelTextColor || '#6b7280',
      '--pp-value-color': props.content?.valueTextColor || '#111827',
      '--pp-gap': (props.content?.cardGap ?? 12) + 'px',
      '--pp-font-size': (props.content?.fontSize ?? 14) + 'px',
      display: 'flex',
      flexDirection: 'column',
      gap: (props.content?.cardGap ?? 12) + 'px',
      width: '100%',
    }));

    const cardStyle = computed(() => ({
      background: props.content?.cardBackground || '#ffffff',
      border: '1px solid ' + (props.content?.cardBorderColor || '#e5e7eb'),
      borderRadius: (props.content?.cardBorderRadius ?? 8) + 'px',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const labelStyle = computed(() => ({
      color: props.content?.labelTextColor || '#6b7280',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const valueStyle = computed(() => ({
      color: props.content?.valueTextColor || '#111827',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const activeBadgeStyle = computed(() => ({
      backgroundColor: '#d1fae5',
      color: '#065f46',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const inactiveBadgeStyle = computed(() => ({
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const fileBadgeStyle = computed(() => ({
      backgroundColor: resolvedPrimaryColor.value,
      color: '#ffffff',
      fontSize: ((props.content?.fontSize ?? 14) - 1) + 'px',
    }));

    const checkedBoxStyle = computed(() => ({
      backgroundColor: resolvedPrimaryColor.value,
      borderColor: resolvedPrimaryColor.value,
    }));

    const uncheckedBoxStyle = computed(() => ({
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
    }));

    const emptyStateStyle = computed(() => ({
      color: props.content?.labelTextColor || '#6b7280',
      fontSize: (props.content?.fontSize ?? 14) + 'px',
    }));

    const getEditButtonStyle = function(id) {
      const isActive = activeState.value[id + '-edit'];
      const isHovered = hoverState.value[id + '-edit'];
      const base = resolvedOutlineColor.value;
      const darkened = isActive ? darken(base, 40) : isHovered ? darken(base, 20) : base;
      return {
        backgroundColor: isHovered ? darkened : '#ffffff',
        color: isHovered ? '#ffffff' : base,
        borderColor: darkened,
        fontSize: (props.content?.fontSize ?? 14) + 'px',
        boxShadow: isHovered && !isActive ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
        transform: isActive ? 'scale(0.97)' : 'scale(1)',
        transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      };
    };

    const getInstructionsButtonStyle = function(id) {
      const isActive = activeState.value[id + '-instructions'];
      const isHovered = hoverState.value[id + '-instructions'];
      const base = resolvedOutlineColor.value;
      const darkened = isActive ? darken(base, 40) : isHovered ? darken(base, 20) : base;
      return {
        backgroundColor: isHovered ? darkened : '#ffffff',
        color: isHovered ? '#ffffff' : base,
        borderColor: darkened,
        fontSize: ((props.content?.fontSize ?? 14) - 1) + 'px',
        boxShadow: isHovered && !isActive ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
        transform: isActive ? 'scale(0.97)' : 'scale(1)',
        transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      };
    };

    const getIconButtonStyle = function(id, key) {
      const isActive = activeState.value[id + '-' + key];
      const isHovered = hoverState.value[id + '-' + key];
      const base = resolvedOutlineColor.value;
      return {
        color: isHovered ? darken(base, 20) : base,
        backgroundColor: isHovered ? (isActive ? '#f3f4f6' : '#f9fafb') : 'transparent',
        borderColor: 'transparent',
        fontSize: (props.content?.fontSize ?? 14) + 'px',
        transform: isActive ? 'scale(0.95)' : 'scale(1)',
        transition: 'color 0.15s ease, background-color 0.15s ease, transform 0.1s ease',
      };
    };

    const handleEdit = function(item) {
      const payload = item?._original ?? item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'edit-click', event: { page: payload } });
    };

    const handleInstructions = function(item) {
      const payload = item?._original ?? item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'instructions-click', event: { page: payload } });
    };

    const handleShare = function(item) {
      const payload = item?._original ?? item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'share-click', event: { page: payload } });
    };

    const handleLink = function(item) {
      const payload = item?._original ?? item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'link-click', event: { page: payload } });
    };

    return {
      processedItems,
      containerStyle,
      cardStyle,
      labelStyle,
      valueStyle,
      activeBadgeStyle,
      inactiveBadgeStyle,
      fileBadgeStyle,
      checkedBoxStyle,
      uncheckedBoxStyle,
      emptyStateStyle,
      getEditButtonStyle,
      getInstructionsButtonStyle,
      getIconButtonStyle,
      handleEdit,
      handleInstructions,
      handleShare,
      handleLink,
      setHover,
      setActive,
      selectedItem,
      itemCount,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style scoped>
.pp-card-list {
  width: 100%;
  box-sizing: border-box;
}

.pp-card {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--pp-card-bg, #ffffff);
  border: 1px solid var(--pp-card-border, #e5e7eb);
  border-radius: var(--pp-card-radius, 8px);
  font-size: var(--pp-font-size, 14px);
}

.card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.card-actions-bottom {
  border-top: 1px solid var(--pp-card-border, #e5e7eb);
  padding-top: 10px;
  margin-top: 2px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: var(--pp-font-size, 14px);
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  border: 1.5px solid;
}

.btn-icon {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: var(--pp-font-size, 14px);
}

.card-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 22px;
}

.card-field-column {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.field-label {
  color: var(--pp-label-color, #6b7280);
  font-size: var(--pp-font-size, 14px);
  font-weight: 400;
  flex-shrink: 0;
}

.field-value {
  color: var(--pp-value-color, #111827);
  font-size: var(--pp-font-size, 14px);
  font-weight: 500;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.page-name-value {
  color: var(--pp-value-color, #111827);
  font-weight: 600;
  text-align: left;
}

.folder-name-sub {
  font-size: calc(var(--pp-font-size, 14px) - 1px);
  font-style: italic;
  color: var(--pp-label-color, #6b7280);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: var(--pp-font-size, 14px);
  font-weight: 500;
}

.file-types-value {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}

.file-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: calc(var(--pp-font-size, 14px) - 1px);
  font-weight: 600;
  color: #ffffff;
  background: var(--pp-primary, #2d6a4f);
}

.checkbox-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.checkbox-box {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1.5px solid #d1d5db;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  pointer-events: none;
  user-select: none;
}

.empty-state {
  width: 100%;
  padding: 32px 16px;
  text-align: center;
  color: var(--pp-label-color, #6b7280);
  font-size: var(--pp-font-size, 14px);
  box-sizing: border-box;
}
</style>
