import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../state/reducers';
import {
	Button,
	Checkbox,
	Dropdown,
	DropdownProps,
	Form,
	Grid,
	GridColumn,
	Icon,
	Modal,
	Progress
} from "semantic-ui-react";
import { submitOneJob } from "../../api/batch-transcribe-api";


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

  // const [state, dispatch] = React.useReducer(exampleReducer, {
  //   open: false,
  //   size: undefined,
  // });
  // const { open, size } = state;
  //const { sub } = useSelector((state: RootState) => state.authReducer);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
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
  const [progressBar, setProgressBar] = useState<
    Array<{
      percent: number;
      isActive: boolean;
      isHidden: boolean;
      hasError: boolean;
      label: string;
    }>
  >([]);

  const clearState = () => {
    setUploadDisabled(true);
    setCancelDisabled(false);
    setOptionsDisabled(false);
    setUploadArray([]);
    setProgressBar([]);
  };
  function exampleReducer(state: any, action: any) {
      switch (action.type) {
        case "close":
          clearState();
          return { open: false };
        case "open":
          return { open: true, size: action.size };
        default:
          throw new Error("Unsupported action...");
      }
    }
  
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;

  const createProgressBar = async (
    uploadPercent: number,
    uploadIsActive: boolean,
    uploadIsHidden: boolean,
    uploadHasError: boolean,
    uploadLabel: string
  ) => {
    let newBar = {
      percent: uploadPercent,
      isActive: uploadIsActive,
      isHidden: uploadIsHidden,
      hasError: uploadHasError,
      label: uploadLabel,
    };
    setProgressBar((prev) => [...prev, newBar]);
  };

  const handleProgressChange = (
    i: number,
    data: {
      uploadPercent: number;
      uploadIsActive: boolean;
      uploadIsHidden: boolean;
      uploadHasError: boolean;
      uploadLabel: string;
    }
  ) => {
    const progressArray = progressBar.slice();
    progressArray[i].percent = data.uploadPercent;
    progressArray[i].isActive = data.uploadIsActive;
    progressArray[i].isHidden = data.uploadIsHidden;
    progressArray[i].hasError = data.uploadHasError;
    progressArray[i].label = data.uploadLabel;
    setProgressBar(progressArray);
  };

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
    createProgressBar(0, false, true, false, "");
    setUploadDisabled(false);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    //https://thewebdev.info/2021/03/20/how-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript/
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleLangChange = (i: number, data: DropdownProps) => {
    var array = [...uploadArray];
    let file = { ...array[i] };
    file.lang = data.value as string;
    array[i] = file;
    setUploadArray(array);
    //console.log(uploadArray[i]);
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
    console.log("remove index " + index);
    var array = [...uploadArray];
    var progressArray = [...progressBar];
    if (index !== -1) {
      array.splice(index, 1);
      setUploadArray(array);
      progressArray.splice(index, 1);
      setProgressBar(progressArray);
    }
  };

  // function timeout(delay: number) {
  //   return new Promise((res) => setTimeout(res, delay));
  // }

  const uploadFile = async () => {
    setCancelDisabled(true);
    setUploadDisabled(true);
    setOptionsDisabled(true);
    uploadArray.forEach(async (item, i) => {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("lang", item.lang);
      formData.append("audioType", item.audioType);
      formData.append("audioTrack", item.audioTrack);

      handleProgressChange(i, {
        uploadPercent: 50,
        uploadIsActive: true,
        uploadIsHidden: false,
        uploadHasError: false,
        uploadLabel: "Uploading...",
      });

      const res = submitOneJob(formData);
      console.log((await res).data);
      if ((await res).data === 201) {
        handleProgressChange(i, {
          uploadPercent: 100,
          uploadIsActive: false,
          uploadIsHidden: false,
          uploadHasError: false,
          uploadLabel: "Upload Successful!",
        });
      } else {
        handleProgressChange(i, {
          uploadPercent: 0,
          uploadIsActive: false,
          uploadIsHidden: false,
          uploadHasError: true,
          uploadLabel: "Upload Error",
        });
      }
      setCancelDisabled(false);
    });
  };

  
  // function exampleReducer(state: any, action: any) {
  //   switch (action.type) {
  //     case "close":
  //       resetState();
  //       return { open: false };
  //     case "open":
  //       return { open: true, size: action.size };
  //     default:
  //       throw new Error("Unsupported action...");
  //   }
  // }

  return (
    <div>
      <Button onClick={() => dispatch({ type: "open", size: "large" })}>
        Upload Files
      </Button>
      <Modal
        as={Form}
        size={size}
        open={open}
        // onClose={() => dispatch({ type: "close" })}
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
                  disabled={optionsDisabled}
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
                  disabled={optionsDisabled}
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
                        disabled={optionsDisabled}
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
                  disabled={optionsDisabled}
                  onClick={() => removeFile(i)}
                ></Button>
              </Grid.Column>
              <Grid.Column width="16">
                <div hidden={progressBar[i].isHidden}>
                  <Progress
                    percent={progressBar[i].percent}
                    size="medium"
                    active={progressBar[i].isActive}
                    progress={"percent"}
                    color="green"
                    error={progressBar[i].hasError}
                    label={progressBar[i].label}
                  />
                </div>
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
          disabled={optionsDisabled}
        >
          <Button.Content 
						visible
						>Choose a File</Button.Content>
          <Button.Content hidden>
            <Icon name="file" />
          </Button.Content>
        </Button>
        <input type="file" id="file" hidden onChange={fileChange} />
        <input type="file" id="file" hidden />
        {/* </Modal.Content> */}
        <Modal.Actions>
          <Button
            disabled={cancelDisabled}
            negative
            onClick={() => dispatch({ type: "close" })}
          >
            Cancel
          </Button>
          {/* <Button positive onClick={() =>
            dispatch({ type: "close" })}>
            Upload
          </Button> */}
          <Button disabled={uploadDisabled} positive onClick={uploadFile}>
            Upload
          </Button>
        </Modal.Actions>
        {/* <Dimmer active>
      <Loader />
    </Dimmer> */}
      </Modal>
    </div>
  );
};
export default ModalUploadFile;
