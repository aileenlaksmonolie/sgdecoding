import React, {useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Grid,
  GridColumn,
  Modal,
  Icon,
} from "semantic-ui-react";
import { submitOneJob } from '../api/batch-transcribe-api';
import { OfflineTranscribeJob, OfflineTranscribeJobResponse } from '../models/OfflineTranscribeJob.model';




function exampleReducer(state, action) {
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

const ModalUploadFile = (data) => {
  const token = data.accessToken
  //console.log("token: " + token)
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
    
  });
  const { open, size } = state;

  /* function FileData(object) {
    this.file = object;
    this.name = name;
    this.size = size;
    this.lang = "english";
    this.audio = "closetalk";
    this.channel = "multi";
  } */

  const [uploadArray, setUploadArray] = useState([]);
  
  /* uploadArray.forEach(element => {
    
    console.log("File " + uploadArray.indexOf(element))
    console.log(element.file)
    
  }); */

  /* const fileChange = (e) => {
    let selectedFile = e.target.files[0]
    const formData = new FormData();
    formData.append("file", selectedFile);
    let newUpload = new FileData(formData, selectedFile.name, bytesToSize(selectedFile.size));
    setUploadArray((prev) => [...prev, newUpload]);
  }; */

  const fileChange = (e) => {
    let selectedFile = e.target.files[0]
    const formData = new FormData()
    formData.append('file', selectedFile, selectedFile.name)
    formData.append('lang', 'english')
    formData.append('audioType', 'closetalk')
    formData.append('audioTrack', 'multi')
    //let newUpload = new FileData(formData);
    let newUpload = formData
    setUploadArray((prev) => [...prev, newUpload]);
  };

  function bytesToSize(bytes) {
    //https://gist.github.com/lanqy/5193417
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }

  /* const handleLangChange = (i, value) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    file.lang = value
    array[i] = file
    setUploadArray(array)
  }
  const handleAudioChange = (i, value) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    file.audio = value
    array[i] = file
    setUploadArray(array)
  }
  const handleChannelChange = (i) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    if (file.channel === 'multi') {
      file.channel = 'single'
    } else {
      file.channel = 'multi'
    }
    array[i] = file
    setUploadArray(array)
  } */

  const handleLangChange = (i, value) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    file.set('lang', value)
    array[i] = file
    setUploadArray(array)
  }
  const handleAudioChange = (i, value) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    file.audio = value
    array[i] = file
    setUploadArray(array)
  }
  const handleChannelChange = (i) => {
    var array = [...uploadArray]
    let file = {...array[i]}
    if (file.channel === 'multi') {
      file.channel = 'single'
    } else {
      file.channel = 'multi'
    }
    array[i] = file
    setUploadArray(array)
  }

  const removeFile = (index) => {
    console.log('remove')
    console.log(index)
    var array = [...uploadArray];
    if (index !== -1) {
      array.splice(index, 1);
      setUploadArray(array);
    }
  };

  const uploadFile = async () => {

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
  }



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
            <Grid.Column>{item.size}</Grid.Column>
            <Grid.Column>
              <Dropdown compact selection options={languageOptions} value={item.lang} onChange={(e, {value}) => handleLangChange(i, value)}/>
            </Grid.Column>
            <Grid.Column>
              <Dropdown compact selection options={audioOptions} value={item.audioType} onChange={(e, {value}) => handleAudioChange(i, value)}/>
            </Grid.Column>
            <Grid.Column>
              <Grid>
                <Grid.Row columns={3}>
                  <GridColumn>Stereo</GridColumn>
                  <GridColumn>
                    <Checkbox slider checked={(item.audioTrack === 'single') ? true : false} onChange={(e) => handleChannelChange(i)}/>
                  </GridColumn>
                  <GridColumn>Mono</GridColumn>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Button icon='trash alternate outline' onClick={() => removeFile(i)}>
              </Button>
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
