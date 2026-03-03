<template>
  <div class="portal-cards-root">

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-search-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          class="filter-input"
          type="text"
          placeholder="Page Name"
          :value="searchText"
          @input="searchText = $event.target.value"
        />
        <button v-if="searchText" class="clear-btn" @click="searchText = ''" aria-label="Clear search">&#x2715;</button>
      </div>

      <div class="filter-select-wrap">
        <select class="filter-select" :value="statusFilter" @change="statusFilter = $event.target.value">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button v-if="statusFilter !== 'all'" class="clear-btn clear-btn-select" @click="statusFilter = 'all'" aria-label="Clear filter">&#x2715;</button>
      </div>

      <button class="reset-link" @click="resetFilters">Reset</button>
    </div>

    <!-- Cards -->
    <div v-if="filteredItems.length === 0" class="empty-state">No results found.</div>

    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="portal-card"
    >
      <!-- Action Buttons -->
      <div class="card-actions">
        <button
          class="btn-open"
          :style="getOpenButtonStyle(item.id)"
          @mouseenter="setHover('open', item.id, true)"
          @mouseleave="setHover('open', item.id, false)"
          @mousedown="setActive('open', item.id, true)"
          @mouseup="setActive('open', item.id, false)"
          @click="handleOpen(item)"
        >Open</button>
        <button
          class="btn-edit"
          :style="getEditButtonStyle(item.id)"
          @mouseenter="setHover('edit', item.id, true)"
          @mouseleave="setHover('edit', item.id, false)"
          @mousedown="setActive('edit', item.id, true)"
          @mouseup="setActive('edit', item.id, false)"
          @click="handleEdit(item)"
        >Edit</button>
      </div>

      <!-- Active Status -->
      <div class="card-row">
        <span class="card-label">Active</span>
        <span :class="item.is_enabled ? 'badge-active' : 'badge-inactive'">
          {{ item.is_enabled ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <!-- Page Name -->
      <div class="card-row">
        <span class="card-label">Page Name</span>
        <span class="card-value card-value-link" @click="handleNameClick(item)">{{ item.name || '' }}</span>
      </div>

      <!-- File Types -->
      <div class="card-row card-row-wrap">
        <span class="card-label">File Types</span>
        <span class="badge-wrap">
          <span
            v-for="badge in item.fileBadges"
            :key="badge"
            class="file-badge"
          >{{ badge }}</span>
          <span v-if="!item.fileBadges || item.fileBadges.length === 0" class="card-value">&#8212;</span>
        </span>
      </div>

      <!-- Max Size -->
      <div class="card-row">
        <span class="card-label">Max Size</span>
        <span class="card-value">{{ item.maxSizeDisplay }}</span>
      </div>

      <!-- Page Instructions -->
      <div class="card-row">
        <span class="card-label">Page Instructions</span>
        <span class="card-value">{{ item.instructions || '&#8212;' }}</span>
      </div>

      <!-- Expiry Date -->
      <div class="card-row">
        <span class="card-label">Expiry Date</span>
        <span class="card-value">{{ item.expiryDisplay }}</span>
      </div>

      <!-- Captcha -->
      <div class="card-row">
        <span class="card-label">Captcha?</span>
        <span class="card-value">
          <svg v-if="item.captcha_required" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>&#8212;</span>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },

  emits: ['trigger-event'],

  setup(props, { emit }) {

    // ---------- Filter state ----------
    const searchText = ref('');
    const statusFilter = ref('all');

    function resetFilters() {
      searchText.value = '';
      statusFilter.value = 'all';
    }

    // ---------- Hover / Active state ----------
    const hoverState = ref({});
    const activeState = ref({});

    function setHover(type, id, val) {
      var key = type + '_' + id;
      var next = {};
      var keys = Object.keys(hoverState.value);
      for (var i = 0; i < keys.length; i++) {
        next[keys[i]] = hoverState.value[keys[i]];
      }
      next[key] = val;
      hoverState.value = next;
    }

    function setActive(type, id, val) {
      var key = type + '_' + id;
      var next = {};
      var keys = Object.keys(activeState.value);
      for (var i = 0; i < keys.length; i++) {
        next[keys[i]] = activeState.value[keys[i]];
      }
      next[key] = val;
      activeState.value = next;
    }

    function getOpenButtonStyle(id) {
      var isActive = activeState.value['open_' + id];
      var isHovered = hoverState.value['open_' + id];
      if (isActive) {
        return { backgroundColor: '#1a4a35', borderColor: '#1a4a35', color: '#fff' };
      }
      if (isHovered) {
        return { backgroundColor: '#245a41', borderColor: '#245a41', color: '#fff' };
      }
      return {};
    }

    function getEditButtonStyle(id) {
      var isActive = activeState.value['edit_' + id];
      var isHovered = hoverState.value['edit_' + id];
      if (isActive) {
        return { backgroundColor: '#2d6a4f', color: '#fff' };
      }
      if (isHovered) {
        return { backgroundColor: 'rgba(45,106,79,0.08)' };
      }
      return {};
    }

    // ---------- File badge derivation ----------
    function deriveFileBadges(patterns) {
      if (!Array.isArray(patterns) || patterns.length === 0) return [];
      var badges = [];
      var hasPdf = false;
      var hasImage = false;
      var hasOffice = false;
      for (var i = 0; i < patterns.length; i++) {
        var p = patterns[i] || '';
        if (p.indexOf('pdf') !== -1) hasPdf = true;
        if (p.indexOf('image') !== -1 || p.indexOf('png') !== -1 || p.indexOf('jpg') !== -1 || p.indexOf('jpeg') !== -1 || p.indexOf('gif') !== -1 || p.indexOf('webp') !== -1) hasImage = true;
        if (p.indexOf('word') !== -1 || p.indexOf('excel') !== -1 || p.indexOf('powerpoint') !== -1 || p.indexOf('spreadsheet') !== -1 || p.indexOf('presentation') !== -1 || p.indexOf('msword') !== -1 || p.indexOf('officedocument') !== -1) hasOffice = true;
      }
      if (hasPdf) badges.push('PDF');
      if (hasImage) badges.push('Images');
      if (hasOffice) badges.push('Office');
      return badges;
    }

    // ---------- Max size display ----------
    function deriveMaxSize(bytes) {
      if (bytes === null || bytes === undefined || bytes === '') return '—';
      var num = Number(bytes);
      if (isNaN(num) || num <= 0) return '—';
      return (num / (1024 * 1024)).toFixed(0) + ' MB';
    }

    // ---------- Expiry date display ----------
    function deriveExpiry(val) {
      if (!val) return 'mm/dd/yyyy';
      try {
        var d = new Date(val);
        if (isNaN(d.getTime())) return 'mm/dd/yyyy';
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        var yyyy = d.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
      } catch (e) {
        return 'mm/dd/yyyy';
      }
    }

    // ---------- Processed items ----------
    const processedItems = computed(function() {
      var items = (props.content && props.content.data) ? props.content.data : [];
      var formulaUtils = wwLib.wwFormula.useFormula();
      var resolveMappingFormula = formulaUtils.resolveMappingFormula;

      var result = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var id = resolveMappingFormula(props.content && props.content.dataIdFormula, item) || item.id || '';
        var name = resolveMappingFormula(props.content && props.content.dataNameFormula, item) || item.name || '';
        var resolvedIsEnabled = resolveMappingFormula(props.content && props.content.dataIsEnabledFormula, item);
        if (resolvedIsEnabled === null || resolvedIsEnabled === undefined) {
          resolvedIsEnabled = item.is_enabled || false;
        }

        result.push({
          id: id,
          name: name,
          is_enabled: resolvedIsEnabled,
          allowed_mime_patterns: item.allowed_mime_patterns || [],
          max_bytes: item.max_bytes || null,
          instructions: item.instructions || '',
          expires_at: item.expires_at || null,
          captcha_required: item.captcha_required || false,
          folder_id: item.folder_id || null,
          token: item.token || '',
          created_at: item.created_at || null,
          fileBadges: deriveFileBadges(item.allowed_mime_patterns || []),
          maxSizeDisplay: deriveMaxSize(item.max_bytes),
          expiryDisplay: deriveExpiry(item.expires_at),
          _raw: item,
        });
      }
      return result;
    });

    // ---------- Filtered items ----------
    const filteredItems = computed(function() {
      var search = searchText.value ? searchText.value.toLowerCase() : '';
      var status = statusFilter.value || 'all';
      var all = processedItems.value;
      var result = [];
      for (var i = 0; i < all.length; i++) {
        var item = all[i];
        var nameMatch = !search || (item.name && item.name.toLowerCase().indexOf(search) !== -1);
        var statusMatch = status === 'all' ||
          (status === 'active' && item.is_enabled === true) ||
          (status === 'inactive' && item.is_enabled !== true);
        if (nameMatch && statusMatch) result.push(item);
      }
      return result;
    });

    // ---------- Internal variables ----------
    var selectedItemVar = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'selectedItem',
      type: 'object',
      defaultValue: null,
    });
    var setSelectedItem = selectedItemVar.setValue;

    var itemCountVar = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'itemCount',
      type: 'number',
      defaultValue: 0,
    });
    var setItemCount = itemCountVar.setValue;

    var filteredCountVar = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'filteredCount',
      type: 'number',
      defaultValue: 0,
    });
    var setFilteredCount = filteredCountVar.setValue;

    watch(processedItems, function(val) {
      setItemCount(val ? val.length : 0);
    }, { immediate: true });

    watch(filteredItems, function(val) {
      setFilteredCount(val ? val.length : 0);
    }, { immediate: true });

    // ---------- Event handlers ----------
    function handleOpen(item) {
      setSelectedItem(item._raw || item);
      emit('trigger-event', { name: 'open-click', event: { row: item._raw || item } });
    }

    function handleEdit(item) {
      setSelectedItem(item._raw || item);
      emit('trigger-event', { name: 'edit-click', event: { row: item._raw || item } });
    }

    function handleNameClick(item) {
      setSelectedItem(item._raw || item);
      emit('trigger-event', { name: 'name-click', event: { row: item._raw || item } });
    }

    return {
      props,
      searchText,
      statusFilter,
      resetFilters,
      hoverState,
      activeState,
      setHover,
      setActive,
      getOpenButtonStyle,
      getEditButtonStyle,
      filteredItems,
      handleOpen,
      handleEdit,
      handleNameClick,
    };
  },
};
</script>

<style scoped>
.portal-cards-root {
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  padding: 0;
}

/* ---- Filter Bar ---- */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0 12px 0;
  flex-wrap: nowrap;
}

.filter-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 0;
  min-width: 0;
}

.search-icon {
  position: absolute;
  left: 10px;
  pointer-events: none;
  flex-shrink: 0;
}

.filter-input {
  width: 100%;
  padding: 8px 28px 8px 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  background: #fff;
  box-sizing: border-box;
  outline: none;
}

.filter-input:focus {
  border-color: #2d6a4f;
}

.filter-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.filter-select {
  -webkit-appearance: none;
  appearance: none;
  padding: 8px 28px 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  background: #fff;
  cursor: pointer;
  outline: none;
  min-width: 100px;
}

.filter-select:focus {
  border-color: #2d6a4f;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  top: 50%;
  transform: translateY(-50%);
}

.clear-btn:hover {
  color: #555;
}

.clear-btn-select {
  right: 6px;
}

.reset-link {
  background: none;
  border: none;
  color: #2d6a4f;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  flex-shrink: 0;
}

.reset-link:hover {
  color: #1a4a35;
}

/* ---- Empty State ---- */
.empty-state {
  text-align: center;
  color: #888;
  font-size: 14px;
  padding: 32px 0;
}

/* ---- Cards ---- */
.portal-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.btn-open {
  background-color: #2d6a4f;
  color: #fff;
  border: 2px solid #2d6a4f;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.btn-edit {
  background-color: transparent;
  color: #2d6a4f;
  border: 2px solid #2d6a4f;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

/* ---- Card Rows ---- */
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 8px;
}

.card-row:last-child {
  border-bottom: none;
}

.card-row-wrap {
  align-items: flex-start;
}

.card-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 120px;
}

.card-value {
  font-size: 13px;
  color: #111827;
  text-align: right;
  word-break: break-word;
}

.card-value-link {
  color: #2d6a4f;
  text-decoration: underline;
  cursor: pointer;
}

.card-value-link:hover {
  color: #1a4a35;
}

/* ---- Status Badges ---- */
.badge-active {
  display: inline-block;
  background-color: #d1fae5;
  color: #065f46;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 12px;
}

.badge-inactive {
  display: inline-block;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 12px;
}

/* ---- File Type Badges ---- */
.badge-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.file-badge {
  display: inline-block;
  background-color: #2d6a4f;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 12px;
}
</style>
