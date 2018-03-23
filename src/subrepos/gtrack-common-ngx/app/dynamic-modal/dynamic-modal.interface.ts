export interface IDynamicComponentModalConfig {
  component: {
    modalComponentName?: string;
    contentComponentName: string;
    onClose?: any;
    data?: any;
  };
  modal: {
    title: string;
    className?: string;
    hasFooter?: boolean;
    close?: any;
    destroy?: any;
  };
}
