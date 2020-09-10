import { NetInfo, NativeModules } from 'react-native';

const FileUpload = NativeModules.FileUpload;

export default (() => {
  const uploadPickupImage = (imageInfo) => {
    console.log('FileUpload imageInfo:', imageInfo);
    const filePath = 'file:///storage/emulated/0/Pictures/12345.jpg';
    const fileName = filePath
      .split('\\')
      .pop()
      .split('/')
      .pop();
    const absoluetePath = filePath.replace('file://', '');
    const obj = {
      uploadUrl:
        'https://g-ops-qa5.copart.com/cobalt/deu/api/v1/lots/50034309/image?re_upload=true',
      method: 'POST', // default 'POST',support 'POST' and 'PUT'
      headers: {
        Accept: 'application/json',
        authorization:
          'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRpdHlfcm9sZXMiOlsiSFEgM3JkIEZsb29yIiwiTWFpbC1TaWduYXR1cmVzLVVTIiwiUHJpdmF0ZVdpcmVsZXNzQWNjZXNzIiwiVlBOIE5UVCBHcm91cCIsIkFsbE15Q29wYXJ0VXNlcnMiLCJEb2N1bWVudCBSZXRlbnRpb24gTm9uIE1hcmtldGluZyJdLCJlbnRpdHlfbmFtZSI6Ik5hcmVuZHJhIEJhZ2FkZSIsInVzZXJfbmFtZSI6Im5hcmVuZHJhLmJhZ2FkZUBjb3BhcnQuY29tIiwiZW50aXR5X29mZmljZSI6IkNvcnBvcmF0ZSIsImVudGl0eV9pZCI6Im5hYmFnYWRlIiwiYXV0aG9yaXRpZXMiOlsiQWxsTXlDb3BhcnRVc2VycyIsIlByaXZhdGVXaXJlbGVzc0FjY2VzcyIsIkRvY3VtZW50IFJldGVudGlvbiBOb24gTWFya2V0aW5nIiwiSFEgM3JkIEZsb29yIiwiTWFpbC1TaWduYXR1cmVzLVVTIiwiVlBOIE5UVCBHcm91cCJdLCJjbGllbnRfaWQiOiJhdXRoX3Byb3h5IiwiZW50aXR5X21haWwiOiJOYXJlbmRyYS5CYWdhZGVAQ29wYXJ0LkNvbSIsImVudGl0eV90eXBlIjoiZW1wbG95ZWUiLCJzY29wZSI6WyJsb2dpbiJdLCJlbnRpdHlfY291bnRyeSI6IlVTIiwiZXhwIjoxNTIwNDY3OTc2LCJqdGkiOiI4OTQzMDY4Mi1lYzEzLTRkYzQtYTBkZC1hOWQyZmM0MzFjNWMifQ.bmDIWxdq68o3TAdFp_fEN5HjHnQeFNfFK2frkX1BvQ3bszffggHRd7RVmh54EwEssL72hGcl1b9RJD-7T9KrpfH_PGbDeYWjJRTp3SsJ7fijPR3rCcaGg4eMysUzJjqdLJWDiJ2QKGvt-C0s96o6DL6mV0-97NbiTR8828IuGuvEK2ySpYVUSN7wpVjFQDcwnT12nMyAyYjaT3-8IfMyP9Zc54Nxg1GNnW2_x-MuZlAAJC7WJJl16m9nTZ3D_4bnWbBhBT2Enwl8Qn58QvbFnjx8IE3Ss8-p44M5Lh3omXZOzWHFSnFduSUcT2VUtnl_P0pcGogD59GyEU362EY4LA',
        Connection: 'close',
        AUTHORIZATIONROLE: 'germany_executive',
      },
      fields: {
        sequence: '7',
      },
      files: [
        {
          filename: '12345.jpg', // fileName,
          filepath: '/storage/emulated/0/Pictures/12345.jpg', // require, file absoluete path
        },
      ],
    };
    FileUpload.upload(obj, (err, result) => {
      if (result && result.status === 200) {
        console.log('FileUpload success:');
        // delete  file
      } else {
        console.log('upload image failed:', err, result);
      }
    });
  };
  return {
    uploadPickupImage,
  };
})();
