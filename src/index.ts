import ReactNativeWidgetExtension from "./ReactNativeWidgetExtensionModule";

export function areActivitiesEnabled(): boolean {
  return ReactNativeWidgetExtension.areActivitiesEnabled();
}

export function startActivity(...args: any): void {
  return ReactNativeWidgetExtension.startActivity(...args);
}

export function startPizzaActivity({
  numberOfPizzas,
  totalAmount,
  orderNumber,
  driverName,
  minutes,
  seconds,
}: {
  numberOfPizzas: number;
  totalAmount: string;
  orderNumber: string;
  driverName: string;
  minutes: number;
  seconds: number;
}): void {
  return ReactNativeWidgetExtension.startActivity(
    numberOfPizzas,
    totalAmount,
    orderNumber,
    driverName,
    minutes,
    seconds
  );
}

export function updateActivity({
  driverName,
  minutes,
  seconds,
}: {
  driverName: string;
  minutes: number;
  seconds: number;
}): void {
  return ReactNativeWidgetExtension.updateActivity(
    driverName,
    minutes,
    seconds
  );
}

export function endActivity({ driverName }: { driverName: string }): void {
  return ReactNativeWidgetExtension.endActivity(driverName);
}
