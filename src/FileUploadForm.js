import React from 'react'
import axios from 'axios';

class FileUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            file:null,
            msg: '',
            fileName:'',
            fileSize:'',
            fileType:'',
            progressNumber:'',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }
    async uploadFile(file){
        let that = this;
        const formData = new FormData();
        formData.append('avatar',file);
        return  await axios.post('http://192.168.101.164:9007/api/up',formData,{
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress (u){
                if (u.lengthComputable) {
                    let percentComplete = Math.round(u.loaded * 100 / u.total);
                    that.setState({progressNumber:percentComplete});
                } else {
                    that.setState({progressNumber:'unable to compute'});
                }
            }
        });
    }
    async onSubmit(e){
        e.preventDefault();
        this.uploadFile(this.state.file).then((response)=>{
            this.setState({msg:JSON.stringify(response.data)});
        });
    }
    onChange(e) {
        let sfile = e.target.files[0];
        if (sfile) {
            var fileSize = 0;
            if (sfile.size > 1024 * 1024){
                fileSize = (Math.round(sfile.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            } else {
                fileSize = (Math.round(sfile.size * 100 / 1024) / 100).toString() + 'KB';
            }
            this.setState({file:sfile, fileName:'文件名: ' + sfile.name, fileSize:'大小: ' + fileSize,fileType:'类型: ' + sfile.type});
        }
    }
    render() {
        return (
            <div>
            <form onSubmit={ this.onSubmit }>
                <div className="row">
                <h1>Yiyifs React File Upload Example</h1>
                <input type="file" onChange={ this.onChange } />
                </div>
                <div>{this.state.fileName}</div>
                <div>{this.state.fileSize}</div>
                <div>{this.state.fileType}</div>
                <div className="row">
                    <button type="submit">上传文件</button>
                </div>
                <div>{this.state.progressNumber}</div>
            </form>
                <h5>{this.state.msg}</h5>
            </div>
        )
    }
}
export default FileUploadForm;
