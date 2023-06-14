const messages = {
  modifiers: {
    LARGE: 'large',
    SMALL: 'small',
  },
  texts: {
    REQUARED: 'is required',
    COMPLITE: 'Publish Complete!',
    ERROR: 'Whoops! Some fields need your attention :o',
  },
  placeholders: {
    DATE: '4/19/2023',
    NEW_POST: 'New Post',
    DESCRIPTION: 'Please, enter any description',
    AUTHOR_NAME: 'Enter author name',
    UPLOAD_NOW: 'Upload New',
    UPLOAD: 'Upload',
  }
}

const data = {
  title: '',
  description: '',
  authorName: '',
  publishDate: '',
  authorPhoto: '',
  authorPhotoName: '',
  postImg: '',
  postImgName: '',
  content: '',
}

window.onload = () => {
  const inputs = document.querySelectorAll('.input-field');
  const postTitleInput = document.getElementById('title');
  const postDescriptionInput =  document.getElementById('description');
  const authorNameInput = document.getElementById('author-name');
  const publishDateInput = document.getElementById('publish-date');
  const contentInput = document.getElementById('text-field-content');
  const notification = document.querySelector('.notification');
  const fields = document.querySelectorAll('.field');

  const postDescriptionsPreviews = document.querySelectorAll('.preview-post-decsription');
  const authorNamePreviews = document.querySelectorAll('.preview-post-author-name');
  const postTitlePreviews = document.querySelectorAll('.preview-post-title');
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  const publishDatePreview = document.querySelector('.preview-date');

  const authorPhotoInput = document.getElementById('photo');
  const postImgLarge = document.getElementById('large-hero-img');
  const postImgSmall = document.getElementById('small-hero-img');

  const removeAuthorPhotoElement = document.querySelector('.remove-upload');
  const removeLargePreviewImg = document.querySelector('.remove-upload-large-img');
  const removeSmallPreviewImg = document.querySelector('.remove-upload-small-img');

  const publishButton = document.querySelector('.admin-button');

  publishDateInput.addEventListener('change', () => changeDate(publishDateInput, publishDatePreview));
  postTitleInput.addEventListener('input', () => inputTitle(postTitleInput, postTitlePreviews));
  postDescriptionInput.addEventListener('input', () => inputDescription(postDescriptionInput, postDescriptionsPreviews));
  authorNameInput.addEventListener('input', () => inputAuthorName(authorNameInput, authorNamePreviews));
  contentInput.addEventListener('input', () => changeContent(contentInput))
  authorPhotoInput.addEventListener('change', () => previewImg(authorPhotoInput, InsertAuthorPhoto));
  postImgLarge.addEventListener('change', () => previewImg(postImgLarge, InsertPostImgs, messages.modifiers.LARGE));
  postImgSmall.addEventListener('change', () => previewImg(postImgSmall , InsertPostImgs, messages.modifiers.SMALL));
  removeAuthorPhotoElement.addEventListener('click', () => removeAuthorPhoto(authorPhotoInput, previewAuthorPhotos, removeAuthorPhotoElement));  
  removeLargePreviewImg.addEventListener('click', () => removePostImg(messages.modifiers.LARGE));
  removeSmallPreviewImg.addEventListener('click', () => removePostImg(messages.modifiers.SMALL));

  inputs.forEach(input => input.addEventListener('input', (e) => inputsFill(e)));

  publishButton.addEventListener('click', async () => {
    if (invalidFields(data)){
      showError(notification);
      errorHandle(inputs);
      notificationHandle(inputs);
      markInvalidValue(fields);
      return;
    }

    await fetch('api/post', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        showSuccess(notification);
        clearFields(inputs);
        setTimeout(() => {
          document.location.href = "/home";
        }, 2000);
        return;
      }
      showError(notification);
      errorHandle(inputs);
      notificationHandle(inputs);
    }).catch(() => {
      showError(notification);
    });
  })
}

function markInvalidValue(fields) {
  fields.forEach(field => {
    const error = field.querySelector('.error');
    const input = field.querySelector('.input-field');
    if (!error || !input) {
      return;
    }
    error.innerHTML = '';
    input.classList.remove('incorrect');
    if (!field.querySelector('.input-field').value) {
      const label = field.querySelector('.input-label');
      error.innerHTML = label.innerHTML + messages.texts.REQUARED;
      input.classList.add('incorrect');
    } 
  })
}

function clearFields(inputs) {
  inputs.forEach(input => {
    input.value = "";
  })
}

function notificationHandle(inputs) {
  inputs.forEach(input => {
    input.addEventListener('input', () => checkInputs(input, inputs))
  })
}

function checkInputs(input, inputs) {
  input.removeEventListener('input', () => checkInputs(input, inputs));

  const emptyInputs = [...inputs].filter((input) => !input.value);

  if (emptyInputs.length == 0) { 
    hideNotification();
  }
}

function checkCorrect(input) {
  console.log('checkCorrect')
  if (input.value) {
    
    clearElementError(input);
    const field = input.parentNode;
    field.querySelector('.error').innerHTML = '';
    input.removeEventListener('input', () => checkCorrect(input));
  }
}

function errorHandle(inputs) {
  
  console.log('errorHandle')
  console.log(inputs)
  inputs.forEach(input => {
    input.addEventListener('input', () => checkCorrect(input))
  })
}

function invalidFields(data) {
  for (const key in data) {
    if (!data[key]) return true;
  }
  return false;
}

function showSuccess (notificationElement) {
  if (notificationElement.classList.contains('notification_red')) {
    notificationElement.classList.remove('notification_red');
  }
  notificationElement.innerHTML = messages.texts.COMPLITE;
  notificationElement.classList.add('notification_green');
};

function showError(notificationElement) {
  if (notificationElement.classList.contains('notification_green')) {
    notificationElement.classList.remove('notification_green');
  }
  notificationElement.innerHTML = messages.texts.ERROR;
  notificationElement.classList.add('notification_red');
};

function hideNotification() {
  const notificationElement = document.querySelector('.notification');
  notificationElement.classList.remove('notification_red');
  notificationElement.classList.remove('notification_green');
};

function clearElementError(element) {
  if (element.classList.contains('incorrect')) {
    element.classList.remove('incorrect')
  }
}

function changeContent(content) {
  clearElementError(content);
    
  data.content = content.value;
}

function changeDate(publishDate, previewDate) {
  clearElementError(publishDate);

  const date = new Date(publishDate.value);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (date) {
    previewDate.innerHTML = `${day}/${month + 1}/${year}`;
    data.publishDate = `${day}/${month + 1}/${year}`;
    return;
  }

  previewDate.innerHTML = messages.placeholders.DATE;
}

function inputTitle(postTitleInput, postTitlePreviews) {
  clearElementError(postTitleInput);

  postTitlePreviews.forEach(title => {
    if (postTitleInput.value) {
      title.innerHTML = postTitleInput.value;
    }
    else {
      title.innerHTML = messages.placeholders.NEW_POST;
    }
  });

  data.title = postTitleInput.value;
}

function inputDescription(postDescription, postDescriptionsPreviews) {
  clearElementError(postDescription);

  postDescriptionsPreviews.forEach(description => {
    if (postDescription.value) {
      description.innerHTML = postDescription.value;
    }
    else {
      description.innerHTML = messages.placeholders.DESCRIPTION;
    }
  });

  data.description = postDescription.value;
}

function inputAuthorName(authorName, authorNamePreviews) {
  clearElementError(authorName);

  authorNamePreviews.forEach(name => {
    if (authorName.value) {
      name.innerHTML = authorName.value;
     }
     else {
      name.innerHTML = messages.placeholders.AUTHOR_NAME;
     } 
  });

  data.authorName = authorName.value;
}

function inputsFill(event) {
  const inputValue = event.target.value 
  inputValue ? event.target.classList.add('fill') : event.target.classList.remove('fill');
}

function changePhoto(photo, img) {
  photo.style.background = `url('${img}') no-repeat`;
  photo.style.backgroundSize = `cover`;
  photo.classList.remove('img-empty');
}

function changePostImg(imgElement, img, modifier) {
  imgElement.style.background = `url('${img}') no-repeat`;
  imgElement.style.backgroundPosition = `center center`
  imgElement.style.backgroundSize = `100%`;
  imgElement.classList.remove('img-empty');
  imgElement.classList.remove(`img-empty_${modifier}`);
}

function loadFile(fn, file, modifier) {
  const reader = new FileReader();
  reader.addEventListener("load", () => fn(reader.result, file.name, modifier));
  if (file) {
    reader.readAsDataURL(file);
  }
}

function InsertAuthorPhoto(img, fileName) {
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  const removeAuthorPhoto = document.querySelector('.remove-upload');
  previewAuthorPhotos.forEach(photo => changePhoto(photo, img));
  document.querySelector('.camera-icon').classList.remove('hidden');
  removeAuthorPhoto.classList.remove('hidden');
  document.querySelector('.photo-upload-text').innerHTML = messages.placeholders.UPLOAD_NOW;
  data.authorPhoto = img;
  data.authorPhotoName = fileName;
}

function InsertPostImgs(reader, file, modifier) {
  previews = document.querySelectorAll(`.preview-post-img_${modifier}`);
  previews.forEach(img => changePostImg(img, reader.result, modifier));
  document.querySelector(`.upload-info_${modifier}`).classList.add('hidden');
  document.querySelector(`.remove-upload-block-${modifier}`).style.display = 'flex';
  if (modifier == messages.modifiers.LARGE) {
    data.postImg = reader.result;
    data.postImgName = file.name;
  };
}

function previewImg(fileInput, fn, modifier) {
  const file = fileInput.files[0]; 
  loadFile(fn, file, modifier);
}

function removeAuthorPhoto(authorPhotoInput, previewAuthorPhotos, removeAuthorPhotoElement) {
  authorPhotoInput.value = '';
  document.querySelector('.camera-icon').classList.add('hidden');
  removeAuthorPhotoElement.classList.add('hidden');
  document.querySelector('.photo-upload-text').innerHTML = messages.placeholders.UPLOAD;

  previewAuthorPhotos.forEach(photo => {
    photo.style.background = ``;
    photo.classList.add('img-empty');
  });

  data.authorPhoto = '';
  data.authorPhotoName = '';
}

function removePostImg(modifier) {
  document.querySelector(`.upload-info_${modifier}`).classList.remove('hidden');
  document.querySelector(`.remove-upload-block-${modifier}`).style.display = 'none';
  document.getElementById(`${modifier}-hero-img`).value = '';
  
  previews = document.querySelectorAll(`.preview-post-img_${modifier}`);
  previews.forEach(img => {
    img.style.background = '';
    if (img.classList.contains(`preview-post-img_${modifier}`)) {
      img.classList.add(`img-empty_${modifier}`);
    }
  })

  if (modifier == messages.modifiers.LARGE) {
    data.postImg = '';
    data.postImgName = '';
  }
}