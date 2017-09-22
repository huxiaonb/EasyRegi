import React from 'react';
import ReactDOM from 'react-dom';
//import { Upload, Icon, Modal } from 'antd';
import {Toast} from 'antd-mobile';
import Upload from 'antd/lib/upload';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import './less/image.less'
import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/upload/style/index.less';
import 'antd/lib/modal/style/index.less';

export default class ImagePicker extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleRemove(file){
    this.props.presave(file,'del',this.props.type);
    this.setState({
      fileList : []
    })
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(img, reader.result));
    reader.readAsDataURL(img);
  }
  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

  beforeUpload(file) {
        const {type} = this.props;
        const isLt2M = file.size / 1024 / 1024 < 5
        let _this = this;
        if (!isLt2M) {
            Toast.info('Image must smaller than 5MB!');
            return false;
        }else{
            let url = this.getBase64(file, (file,imageUrl) => {
              _this.setState({
                fileList : [{
                  uid : file.uid,
                  name : file.name,
                  status : 'done',
                  url : imageUrl
                }]
              });
              //var blob = _this.dataURItoBlob(imageUrl);
              const formData = new FormData();
              //formData.append('xxx', file)      
              //formData.append('files[]', blob);
              formData.append('file', file);
              _this.props.presave(formData, 'add', type);
              // var reader = new FileReader();
              // reader.onload = function(e){
              //   //console.log(e.target.result);
              //   let fileObj = {
              //     fileObj : file,
              //     originalObj : e.target.result
              //   }
              //   _this.props.presave(fileObj, 'add', type);
              // }
              // reader.readAsText(file); 
            });
        }
        return false;
    }

   //handleChange = ({ fileList }) => this.setState({ fileList })
   

  render() {
    const {openId} = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon style={{fontSize:'120px'}} type="plus" />
        <div className="ant-upload-text">{this.props.labelName}</div>
      </div>
    );
    return (
      <div className="clearfix">
      
        <Upload
          action='../weChat/applicant/personalInfo/submit'
          listType="picture-card"
          className="upload-span"
          fileList={fileList}
          onPreview={this.handlePreview.bind(this)}
          onRemove={this.handleRemove.bind(this)}
          beforeUpload={this.beforeUpload.bind(this)}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

