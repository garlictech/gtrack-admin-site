export interface IDynamicComponentModalConfig {
  component: {
    name: string;
    onClose?: any;
    data?: any;
  };
  modal: {
    title: string;
    className?: string;
    close?: any;
    destroy?: any;
  };
}
