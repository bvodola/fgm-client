import React from "react";
import FadeIn from "react-fade-in";
import styled from "styled-components";

const FakeInput = styled.div`
  border: 0;
  font-size: 13px;
  color: #000;
  background: #fff;
  border-radius: 30px;
  padding: 12px 16px;
  border: none;
  height: 48px;
  outline: none;
  width: 100%;
  font-size: 20px;
  cursor: pointer;
`;

const ThumbnailWrapper = styled.div`
  position: relative;

  img {
    width: 100%;
    border-radius: 8px;
    image-orientation: from-image;
  }

  .icon {
    cursor: pointer;
    position: absolute;
    color: #000;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 100%;
    right: 10px;
    top: 10px;
  }
`;

const CloseIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 100%;
  padding: 3px 11px;
  cursor: pointer;
`;

const FileName = styled.span`
  text-align: left;
  margin-left: 60px;
  padding-top: 9px;
  display: block;
  font-weight: bold;
`;

const Thumbnail = ({ src, fileObject, alt, close }) => (
  <ThumbnailWrapper>
    <CloseIcon onClick={close}>x</CloseIcon>
    {fileObject.type !== "application/pdf" ? (
      <img src={src} alt={alt} />
    ) : (
      <FileName>{fileObject.name}</FileName>
    )}
  </ThumbnailWrapper>
);

const FileUploader = ({
  style,
  close,
  onChange,
  files,
  placeholder,
  formats,
  ...props
}) => (
  <div>
    {files.length === 0 ? (
      <React.Fragment>
        <label htmlFor="fileInput">
          <FakeInput style={style}>{placeholder}</FakeInput>
        </label>
        <input
          {...props}
          accept={formats}
          style={{ display: "none" }}
          id="fileInput"
          type="file"
          onChange={onChange}
        />
      </React.Fragment>
    ) : (
      files.map(file => (
        <FadeIn key={file._id}>
          <Thumbnail
            src={file.src}
            fileObject={file.file}
            alt=""
            close={() => close(file._id)}
          />
        </FadeIn>
      ))
    )}
  </div>
);

export default FileUploader;

FileUploader.defaultProps = {
  files: []
};
