import React, { useState } from "react";
import {
	Button,
	Checkbox,
	Dropdown, DropdownProps, Form,
	Grid,
	GridColumn, Icon, Modal
} from "semantic-ui-react";
import { submitOneJob } from '../../api/batch-transcribe-api';


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

const ModalUploadFile: React.FC = () => {

  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;
  const [uploadArray, setUploadArray] = useState<
    Array<{
      file: File;
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

  const formatBytes = (bytes: number, decimals = 2) => {
    //https://thewebdev.info/2021/03/20/how-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript/
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

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

  const uploadFile = async () => {

    uploadArray.forEach(async (item) => {
      const formData = new FormData();
      //formData.append('token', accessToken)
      formData.append('file', item.file);
      formData.append('lang', item.lang);
      formData.append('audioType', item.audioType);
      formData.append('audioTrack', item.audioTrack);
      
      console.log(formData);
      submitOneJob(formData);

    });
  };

  return (
    <div>
      <Button onClick={() => dispatch({ type: "open", size: "large" })}>
        Upload Files
      </Button>
      <Modal
        as={Form}
        size={size}
        open={open}
        onClose={() => dispatch({ type: "close" })}
      >
        <Modal.Header>Upload Audio Files</Modal.Header>
        {/* <Modal.Content scrolling> */}
        <Grid padded textAlign="center" container>
          <Grid.Row columns={6}>
            <Grid.Column>
              <strong>Name</strong>
            </Grid.Column>
            <Grid.Column>
              <strong>Size</strong>
            </Grid.Column>
            <Grid.Column>
              <strong>Language</strong>
            </Grid.Column>
            <Grid.Column>
              <strong>Audio Type</strong>
            </Grid.Column>
            <Grid.Column>
              <strong>Channel</strong>
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
          {uploadArray.map((item, i) => (
            <Grid.Row key={i} columns="6">
              <Grid.Column>{item.name}</Grid.Column>
              <Grid.Column>{formatBytes(item.size)}</Grid.Column>
              <Grid.Column>
                <Dropdown
                  compact
                  selection
                  options={languageOptions}
                  value={item.lang}
                  onChange={(
                    e: React.SyntheticEvent<HTMLElement, Event>,
                    data: DropdownProps
                  ) => handleLangChange(i, data)}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  compact
                  selection
                  options={audioOptions}
                  value={item.audioType}
                  onChange={(
                    e: React.SyntheticEvent<HTMLElement, Event>,
                    data: DropdownProps
                  ) => handleAudioChange(i, data)}
                />
              </Grid.Column>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={3}>
                    <GridColumn>Stereo</GridColumn>
                    <GridColumn>
                      <Checkbox
                        slider
                        checked={item.audioTrack === "single" ? true : false}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                          handleChannelChange(i)
                        }
                      />
                    </GridColumn>
                    <GridColumn>Mono</GridColumn>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Button
                  icon="trash alternate outline"
                  onClick={() => removeFile(i)}
                ></Button>
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
        {/* <Button attached="bottom" onClick={handleClick}>
          Add More Files
        </Button> */}
        <Button
          as="label"
          htmlFor="file"
          type="button"
          animated="fade"
          attached="bottom"
        >
          <Button.Content visible>Choose a File</Button.Content>
          <Button.Content hidden>
            <Icon name="file" />
          </Button.Content>
        </Button>
        <input type="file" id="file" hidden onChange={fileChange} />
        <input type="file" id="file" hidden />
        {/* </Modal.Content> */}
        <Modal.Actions>
          <Button negative onClick={() => dispatch({ type: "close" })}>
            Cancel
          </Button>
          {/* <Button positive onClick={() =>
            dispatch({ type: "close" })}>
            Upload
          </Button> */}
          <Button positive onClick={uploadFile}>
            Upload
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};
export default ModalUploadFile;
