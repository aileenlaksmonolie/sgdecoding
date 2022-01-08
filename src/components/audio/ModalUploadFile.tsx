import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Grid,
  GridColumn,
  Modal,
  Icon,
  DropdownProps,
} from "semantic-ui-react";

interface Props {
  accessToken: String;
}

function exampleReducer(state: any, action: any) {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      return { open: true, size: action.size };
    default:
      throw new Error("Unsupported action...");
  }
}

const languageOptions = [
  {
    text: "english",
    value: "english",
  },
  {
    text: "mandarin",
    value: "mandarin",
  },
  {
    text: "malay",
    value: "malay",
  },
  {
    text: "english-mandarin",
    value: "english-mandarin",
  },
  {
    text: "english-malay",
    value: "english-malay",
  },
];

const audioOptions = [
  {
    text: "fartalk",
    value: "fartalk",
  },
  {
    text: "closetalk",
    value: "closetalk",
  },
  {
    text: "mobile",
    value: "mobile",
  },
  {
    text: "telephony",
    value: "telephony",
  },
  {
    text: "boundary",
    value: "boundary",
  },
];

const ModalUploadFile: React.FC<Props> = ({ accessToken }) => {
  const token = accessToken;
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;
  const [uploadArray, setUploadArray] = useState<
    Array<{
      file: object;
      name: string;
      size: number;
      lang: string;
      audioType: string;
      audioTrack: string;
    }>
  >([]);

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files![0];
    let newUpload = {
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      lang: "english",
      audioType: "closetalk",
      audioTrack: "multi",
    };
    setUploadArray((prev) => [...prev, newUpload]);
  };

  /* function bytesToSize(bytes: number) {
    //https://gist.github.com/lanqy/5193417
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  } */

  const handleLangChange = (i: number, data: DropdownProps) => {
    var array = [...uploadArray];
    let file = { ...array[i] };
    file.lang = data.value as string;
    array[i] = file;
    setUploadArray(array);
  };
  const handleAudioChange = (i: number, data: DropdownProps) => {
    var array = [...uploadArray];
    let file = { ...array[i] };
    file.audioType = data.value as string;
    array[i] = file;
    setUploadArray(array);
  };
  const handleChannelChange = (i: number) => {
    var array = [...uploadArray];
    let file = { ...array[i] };
    if (file.audioTrack === "multi") {
      file.audioTrack = "single";
    } else {
      file.audioTrack = "multi";
    }
    array[i] = file;
    setUploadArray(array);
  };

  const removeFile = (index: number) => {
    console.log("remove");
    console.log(index);
    var array = [...uploadArray];
    if (index !== -1) {
      array.splice(index, 1);
      setUploadArray(array);
    }
  };

  /* const uploadFile = async () => {

    uploadArray.forEach(item => {
      submitOneJob({
        token: token,
        file: item.file,
        lang: item.lang,
        audioType: item.audio,
        audioTrack: item.channel,
      });
      console.log("job submission attempt")
    })
  } */

  uploadArray.forEach((element) => {
    console.log("File " + uploadArray.indexOf(element));
    console.log(element);
  });

  return (
    <div>
      test
    </div>
  );

}
export default ModalUploadFile