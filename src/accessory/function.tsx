import { tVariables } from '@/store/variablesStore';

export interface Vars {
  [key: string]: string;
}

export const replaceVariables = (
  template: string,
  vars: tVariables
): [string, boolean] => {
  let result = template;
  const obj: Vars = {};

  vars.forEach((item) => {
    if (!item.select) return;
    obj[item.key] = item.value;
  });

  const regExp = /{{\s*.+\s*}}/;
  const onVars = regExp.test(result);

  Object.keys(obj).forEach((key) => {
    const regex = new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'g');
    result = result.replace(regex, obj[key]);
  });

  return [result, onVars];
};

export const textToBase64 = (text: string, path: string, num: number) => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(text);
  const binaryString = String.fromCharCode(...uint8Array);

  const arr = path.split('/');
  if (arr.length > num) {
    arr[num] = btoa(binaryString);
  } else {
    arr.push(btoa(binaryString));
  }
  return arr.join('/');
};

export const base64ToText = (b64: string): string => {
  const binaryString = atob(b64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
};

export const preSelectHeaders = (value: string) => {
  const tmp = {
    id: 0,
    key: '',
    value: '',
    select: false,
  };

  switch (value) {
    case 'form':
      tmp.key = 'Content-Type';
      tmp.value = 'application/x-www-form-urlencoded';
      tmp.select = true;
      break;
    case 'json':
      tmp.key = 'Content-Type';
      tmp.value = 'application/json';
      tmp.select = true;
      break;
    case 'text':
      tmp.key = 'Content-Type';
      tmp.value = 'text/plain';
      tmp.select = true;
      break;
    case 'none':
    default:
      break;
  }

  return tmp;
};
