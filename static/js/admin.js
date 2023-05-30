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
  const postDescriptionInput = document.getElementById('description');
  const authorNameInput = document.getElementById('author-name');
  const publishDateInput = document.getElementById('publish-date');
  const notification = document.querySelector('.notification');
  const fields = document.querySelectorAll('.field');

  const postDescriptionsPreviews = document.querySelectorAll('.preview-post-decsription');
  const authorNamePreviews = document.querySelectorAll('.preview-post-author-name');
  const postTitlePreviews = document.querySelectorAll('.preview-post-title');
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  const publishDatePreview = document.querySelector('.preview-date');

  const PostImgPreviews = document.querySelectorAll('.preview-post-img'); 
  const SmallImgsPreviews = document.querySelectorAll('.small-preview-img'); 
  const authorPhotoInput = document.getElementById('photo');
  const postImgLarge = document.getElementById('large-hero-img');
  const postImgSmall = document.getElementById('small-hero-img');

  const removeAuthorPhotoElement = document.querySelector('.remove-upload');
  const removeLargePreviewImg = document.querySelector('.remove-upload-large-img');
  const removeSmallPreviewImg = document.querySelector('.remove-upload-small-img');

  const publishButton = document.querySelector('.admin-button');
  const content = document.getElementById('text-field-content');

  publishDateInput.addEventListener('change', () => changeDate(publishDateInput, publishDatePreview));
  postTitleInput.addEventListener('input', () => inputTitle(postTitleInput, postTitlePreviews));
  postDescriptionInput.addEventListener('input', () => inputDescription(postDescriptionInput, postDescriptionsPreviews));
  authorNameInput.addEventListener('input', () => inputAuthorName(authorNameInput, authorNamePreviews));
  authorPhotoInput.addEventListener('change', () => previewAuthorPhoto(authorPhotoInput));
  postImgLarge.addEventListener('change', () => previewPostImg(postImgLarge, PostImgPreviews, 'large'));
  postImgSmall.addEventListener('change', () => previewPostImg(postImgSmall , SmallImgsPreviews, 'small'));
  removeAuthorPhotoElement.addEventListener('click', () => removeAuthorPhoto(authorPhotoInput, previewAuthorPhotos, removeAuthorPhotoElement));

  inputs.forEach(input => input.addEventListener('input', (e) => inputsFill(e)));
  
  removeLargePreviewImg.addEventListener('click', () => removePostImg(PostImgPreviews, 'large'));
  removeSmallPreviewImg.addEventListener('click', () => removePostImg(SmallImgsPreviews, 'small'));

  publishButton.addEventListener('click', async () => {
    if (invalidFields(data)){
      showError(notification);
      markInvalidValue(fields);
      return;
    }

    await fetch('api/post', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res)=>{
      if (res.ok) {
        showSuccess(notification);
        clearFields(inputs);
        return;
      }
      showError(notification);
    }).catch(() => {
      showError(notification);
    });
  })

  content.addEventListener('input', () => {
    if (content.classList.contains('incorrect')) {
      content.classList.remove('incorrect')
    }
    data.content = content.value;
  })
}

const markInvalidValue = (fields) => {
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
      error.innerHTML = `${label.innerHTML} is required`;
      input.classList.add('incorrect');
      setTimeout(() => {
        error.innerHTML = '';
        input.classList.remove('incorrect');
      }, 5000);
      return;
    } 
  })
}

const clearFields = (inputs) => {
  inputs.forEach(input => {
    input.value = "";
  })
}

const invalidFields = (data) => {
  for (const key in data) { //same
    if (!data[key]) return true;
  }
  return false;
}

const showSuccess = (notificationElement) => {
  if (notificationElement.classList.contains('notification_red')) {
    notificationElement.classList.remove('notification_red');
  }
  notificationElement.innerHTML = 'Publish Complete!';
  notificationElement.classList.add('notification_green');
  setTimeout(()=> {
    hideNotification(notificationElement);
  }, 5000);
};

const showError = (notificationElement) => { //raf
  if (notificationElement.classList.contains('notification_green')) {
    notificationElement.classList.remove('notification_green');
  }
  notificationElement.innerHTML = 'Whoops! Some fields need your attention :o';
  notificationElement.classList.add('notification_red');
  setTimeout(()=> {
    hideNotification(notificationElement);
  }, 5000);
};

const hideNotification = (notificationElement) => {
  notificationElement.classList.remove('notification_red');
  notificationElement.classList.remove('notification_green');
};

const changeDate = (publishDate, previewDate) => {
  if (publishDate.classList.contains('incorrect')) {
    publishDate.classList.remove('incorrect')
  }
  const date = new Date(publishDate.value);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  date ? previewDate.innerHTML = `${day}/${month + 1}/${year}` : previewDate.innerHTML = '4/19/2023';
  data.publishDate = `${day}/${month + 1}/${year}`;
}

const inputTitle = (postTitleInput, postTitlePreviews) => {
  if (postTitleInput.classList.contains('incorrect')) {
    postTitleInput.classList.remove('incorrect')
  }
  postTitlePreviews.forEach(title => {
    postTitleInput.value ? title.innerHTML = postTitleInput.value : title.innerHTML = 'New Post';
  });
  data.title = postTitleInput.value;
}

const inputDescription = (postDescription, postDescriptionsPreviews) => {
  if (postDescription.classList.contains('incorrect')) {
    postDescription.classList.remove('incorrect')
  }
  postDescriptionsPreviews.forEach(description => {
    postDescription.value ? description.innerHTML = postDescription.value : description.innerHTML = 'Please, enter any description';
  });
  data.description = postDescription.value;
}

const inputAuthorName = (authorName, authorNamePreviews) => {
  if (authorName.classList.contains('incorrect')) {
    authorName.classList.remove('incorrect')
  }
  authorNamePreviews.forEach(name => {
    authorName.value ? name.innerHTML = authorName.value : name.innerHTML = 'Enter author name';
  });
  data.authorName = authorName.value;
}

const inputsFill = (event) => {
  const inputValue = event.target.value 
  inputValue ? event.target.classList.add('fill') : e.target.classList.remove('fill');
}

const changePhoto = (photo, img) => {
  photo.style.background = `url('${img}') no-repeat`;
  photo.style.backgroundSize = `cover`;
  photo.classList.remove('img-empty');
}

const changePostImg = (imgElement, img, modifier) => {
  imgElement.style.background = `url('${img}') no-repeat`;
  imgElement.style.backgroundPosition = `center center`
  imgElement.style.backgroundSize = `100%`;
  imgElement.classList.remove('img-empty');
  imgElement.classList.remove(`img-empty_${modifier}`);
}

const previewAuthorPhoto = (authorPhotoInput) => {
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  const removeAuthorPhoto = document.querySelector('.remove-upload');

  const file = authorPhotoInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
      previewAuthorPhotos.forEach(photo => changePhoto(photo, reader.result));
      document.querySelector('.camera-icon').classList.remove('hidden');
      removeAuthorPhoto.classList.remove('hidden');
      document.querySelector('.photo-upload-text').innerHTML = "Upload New";
      data.authorPhoto = reader.result;
    }
  );

  if (file) {
    reader.readAsDataURL(file);
    data.authorPhotoName = file.name;
  }
}

const previewPostImg = (postImgLarge, PostImgPreviews, modifier) => {
  const file = postImgLarge.files[0];
  const readerImg = new FileReader();

  readerImg.addEventListener("load", () => {
      PostImgPreviews.forEach(img => changePostImg(img, readerImg.result, modifier));
      document.querySelector(`.upload-info_${modifier}`).classList.add('hidden');
      document.querySelector(`.remove-upload-block-${modifier}`).style.display = 'flex';
      if (modifier == 'large') {
        data.postImg = readerImg.result
      };
    }
  );

  if (file) {
    readerImg.readAsDataURL(file);
    if (modifier == 'large') {
      data.postImgName = file.name;
    };
  }
}

const removeAuthorPhoto = (authorPhotoInput, previewAuthorPhotos, removeAuthorPhotoElement) => {
  authorPhotoInput.value = '';
  document.querySelector('.camera-icon').classList.add('hidden');
  removeAuthorPhotoElement.classList.add('hidden');
  document.querySelector('.photo-upload-text').innerHTML = "Upload";

  previewAuthorPhotos.forEach(photo => {
    photo.style.background = ``;
    photo.classList.add('img-empty');
  });

  data.authorPhoto = '';
  data.authorPhotoName = '';
}

const removePostImg = (PostImgPreviews, modifier) => {
  document.querySelector(`.upload-info_${modifier}`).classList.remove('hidden');
  document.querySelector(`.remove-upload-block-${modifier}`).style.display = 'none';
  document.getElementById(`${modifier}-hero-img`).value = '';
  
  PostImgPreviews.forEach(img => {
    img.style.background = '';
    if (img.classList.contains(`preview-post-img_${modifier}`)) {
      img.classList.add(`img-empty_${modifier}`);
    }
  })

  if (modifier == 'large') {
    data.postImg = '';
    data.postImgName = '';
  }
}