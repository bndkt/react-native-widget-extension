import ReactNativeWidgetExtension from "./ReactNativeWidgetExtensionModule";

export function areActivitiesEnabled(): boolean {
  return ReactNativeWidgetExtension.areActivitiesEnabled();
}

export function startActivity(...args: any): void {
  return ReactNativeWidgetExtension.startActivity(...args);
}

export function updateActivity(...args: any): void {
  return ReactNativeWidgetExtension.updateActivity(...args);
}

export function endActivity(...args: any): void {
  return ReactNativeWidgetExtension.endActivity(...args);
}
