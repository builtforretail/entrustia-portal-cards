export default {
  editor: {
    label: 'Public Pages Card List',
    icon: 'view-list',
  },

  properties: {
    data: {
      label: { en: 'Public Pages Data' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          id: 1,
          tenant_id: 1,
          folder_id: 1,
          folder_name: 'Bills',
          name: 'Bills Intake v11',
          instructions: '<p>Only Bills files v11</p>',
          allowed_mime_patterns: [
            { label: 'PDF', value: 'application/pdf' },
            { label: 'Images', value: 'image/*' },
          ],
          max_bytes: 11534336,
          expires_at: '2026-03-08T00:00:00.000Z',
          captcha_required: true,
          notify_emails: '',
          token: 'abc123',
          is_enabled: true,
          created_at: 1700000000000,
        },
        {
          id: 2,
          tenant_id: 1,
          folder_id: 2,
          folder_name: 'City Services',
          name: 'City Services',
          instructions: '',
          allowed_mime_patterns: [
            { label: 'PDF', value: 'application/pdf' },
          ],
          max_bytes: 10485760,
          expires_at: null,
          captcha_required: true,
          notify_emails: '',
          token: 'def456',
          is_enabled: true,
          created_at: 1700000000000,
        },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.name || 'Page ' + (item.id || 'Unknown');
        },
        item: {
          type: 'Object',
          defaultValue: {
            id: 1,
            tenant_id: 1,
            folder_id: 1,
            folder_name: '',
            name: 'New Page',
            instructions: '',
            allowed_mime_patterns: [],
            max_bytes: 0,
            expires_at: null,
            captcha_required: false,
            notify_emails: '',
            token: '',
            is_enabled: false,
            created_at: 0,
          },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Number' },
              tenant_id: { label: { en: 'Tenant ID' }, type: 'Number' },
              folder_id: { label: { en: 'Folder ID' }, type: 'Number' },
              folder_name: { label: { en: 'Folder Name' }, type: 'Text' },
              name: { label: { en: 'Page Name' }, type: 'Text' },
              instructions: { label: { en: 'Instructions' }, type: 'Text' },
              allowed_mime_patterns: { label: { en: 'Allowed MIME Patterns' }, type: 'Array' },
              max_bytes: { label: { en: 'Max Bytes' }, type: 'Number' },
              expires_at: { label: { en: 'Expires At' }, type: 'Text' },
              captcha_required: { label: { en: 'Captcha Required' }, type: 'OnOff' },
              notify_emails: { label: { en: 'Notify Emails' }, type: 'Text' },
              token: { label: { en: 'Token' }, type: 'Text' },
              is_enabled: { label: { en: 'Is Enabled' }, type: 'OnOff' },
              created_at: { label: { en: 'Created At' }, type: 'Number' },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of upload_portal objects from Xano.',
      },
      /* wwEditor:end */
    },

    dataIdFormula: {
      label: { en: 'ID Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['id']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataNameFormula: {
      label: { en: 'Page Name Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['name']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataFolderNameFormula: {
      label: { en: 'Folder Name Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['folder_name']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataIsEnabledFormula: {
      label: { en: 'Is Enabled Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['is_enabled']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataAllowedMimeFormula: {
      label: { en: 'Allowed MIME Patterns Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['allowed_mime_patterns']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataMaxBytesFormula: {
      label: { en: 'Max Bytes Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['max_bytes']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataInstructionsFormula: {
      label: { en: 'Instructions Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['instructions']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataExpiresAtFormula: {
      label: { en: 'Expires At Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['expires_at']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataCaptchaRequiredFormula: {
      label: { en: 'Captcha Required Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['captcha_required']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    primaryColor: {
      label: { en: 'Primary Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2d6a4f',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CSS color value for filled buttons and active badge' },
      /* wwEditor:end */
    },

    outlineColor: {
      label: { en: 'Outline Color (Edit Button)' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2d6a4f',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CSS color for outlined buttons' },
      /* wwEditor:end */
    },

    cardBackground: {
      label: { en: 'Card Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Background color of each card' },
      /* wwEditor:end */
    },

    cardBorderColor: {
      label: { en: 'Card Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e5e7eb',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Border color of each card' },
      /* wwEditor:end */
    },

    cardBorderRadius: {
      label: { en: 'Card Border Radius (px)' },
      type: 'Number',
      section: 'style',
      min: 0,
      max: 32,
      step: 1,
      defaultValue: 8,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Border radius in pixels' },
      /* wwEditor:end */
    },

    labelTextColor: {
      label: { en: 'Label Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#6b7280',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Color for field labels' },
      /* wwEditor:end */
    },

    valueTextColor: {
      label: { en: 'Value Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#111827',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Color for field values' },
      /* wwEditor:end */
    },

    cardGap: {
      label: { en: 'Card Gap (px)' },
      type: 'Number',
      section: 'style',
      min: 0,
      max: 64,
      step: 1,
      defaultValue: 12,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Vertical gap between cards in pixels' },
      /* wwEditor:end */
    },

    fontSize: {
      label: { en: 'Font Size (px)' },
      type: 'Number',
      section: 'style',
      min: 10,
      max: 24,
      step: 1,
      defaultValue: 14,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Base font size in pixels' },
      /* wwEditor:end */
    },
  },

  triggerEvents: [
    {
      name: 'edit-click',
      label: { en: 'On Edit click' },
      event: { page: null },
    },
    {
      name: 'instructions-click',
      label: { en: 'On Page Instructions click' },
      event: { page: null },
    },
    {
      name: 'share-click',
      label: { en: 'On Share click' },
      event: { page: null },
    },
    {
      name: 'link-click',
      label: { en: 'On Link click' },
      event: { page: null },
    },
  ],
};
