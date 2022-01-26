export function exportToJsonFile(jsonData: any) {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let exportFileDefaultName = 'wordle-results-history.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importFromJson(jsonStringData: string) {
  const json = JSON.parse(jsonStringData);
  return json;
}

export function saveToLocaStorage(key: string, value: any) {
  const json = JSON.stringify(value);
  localStorage.setItem(key, json);
}

export function clearLocaStorage(key: string) {
  localStorage.removeItem(key);
}

export function loadFromLocalStorage(key: string): any {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : '';
}

export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}