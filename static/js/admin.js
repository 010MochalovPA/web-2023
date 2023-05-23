const inputs = document.querySelectorAll('.input-field'); //window.onload
const postTitle = document.getElementById('title');
const postDescription = document.getElementById('description');
const authorName = document.getElementById('author-name');
const publishDate = document.getElementById('publish-date');
const authorPhoto = document.getElementById('photo');
const postImgLarge = document.getElementById('large-hero-img');
const postImgSmall = document.getElementById('small-hero-img');
const removeAuthorPhoto = document.querySelector('.remove-upload');
const removeLargePreviewImg = document.querySelector('.remove-upload-large-img');
const removeSmallPreviewImg = document.querySelector('.remove-upload-small-img')
const publishButton = document.querySelector('.admin-button');
const content = document.getElementById('text-field-content');

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

publishDate.addEventListener('change', () => {
  const previewDate = document.querySelector('.preview-date');
  const date = new Date(publishDate.value);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  date ? previewDate.innerHTML = `${day}/${month + 1}/${year}` : previewDate.innerHTML = '4/19/2023';
  data.publishDate = `${day}/${month + 1}/${year}`;
})

postTitle.addEventListener('input', () => {
  const previewTitles = document.querySelectorAll('.preview-post-title'); 
  previewTitles.forEach(title => {
    postTitle.value ? title.innerHTML = postTitle.value : title.innerHTML = 'New Post';
    data.title = postTitle.value;
  })
})

postDescription.addEventListener('input', () => {
  const previewDescriptions = document.querySelectorAll('.preview-post-decsription'); 
  previewDescriptions.forEach(description => {
    postDescription.value ? description.innerHTML = postDescription.value : description.innerHTML = 'Please, enter any description';
    data.description = postDescription.value;
  })
})

authorName.addEventListener('input', () => {
  const previewAuthorNames = document.querySelectorAll('.preview-post-author-name'); 
  previewAuthorNames.forEach(name => {
    authorName.value ? name.innerHTML = authorName.value : name.innerHTML = 'Enter author name';
    data.authorName = authorName.value;
  })
})

inputs.forEach(input => input.addEventListener('input', (e) => {
  const inputValue = e.target.value 
  inputValue ? e.target.classList.add('fill') : e.target.classList.remove('fill');
}))

function previewAuthorPhoto() {
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  
  const file = document.getElementById("photo").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
      previewAuthorPhotos.forEach(photo => {
        photo.style.background = `url('${reader.result}') no-repeat`;
        photo.style.backgroundSize = `cover`;
        photo.classList.remove('img-empty');
      });
      document.querySelector('.camera-icon').classList.remove('hidden');
      removeAuthorPhoto.classList.remove('hidden');
      document.querySelector('.photo-upload-text').innerHTML = "Upload New";
      data.authorPhoto = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
    data.authorPhotoName = file.name;
  }
}

function previewPostImg() {
  const previewPostImgs = document.querySelectorAll('.preview-post-img'); 
  const file = document.getElementById("large-hero-img").files[0];
  const readerImg = new FileReader();

  readerImg.addEventListener("load", () => {
      previewPostImgs.forEach(img => {
        img.style.background = `url('${readerImg.result}') no-repeat`;
        img.style.backgroundPosition = `center center`
        img.style.backgroundSize = `100%`;
        img.classList.remove('img-empty');
        img.classList.remove('img-empty_large');
      });
      document.querySelector('.upload-info_large').classList.add('hidden');
      document.querySelector('.remove-upload-block-large').style.display = 'flex';
      data.postImg = readerImg.result;
    },
    false
  );

  if (file) {
    readerImg.readAsDataURL(file);
    data.postImgName = file.name;
  }
}

function previewSmallPostImg() {
  const previewSmallPostImgs = document.querySelectorAll('.small-preview-img'); 
  const file = document.getElementById("small-hero-img").files[0];
  const readerImg = new FileReader();

  readerImg.addEventListener("load", () => {
      previewSmallPostImgs.forEach(img => {
        img.style.background = `url('${readerImg.result}') no-repeat`;
        img.style.backgroundPosition = `center center`
        img.style.backgroundSize = `100%`;
        img.classList.remove('img-empty');
        img.classList.remove('img-empty_small');
      });
      document.querySelector('.upload-info_small').classList.add('hidden');
      document.querySelector('.remove-upload-block-small').style.display = 'flex';
    },
    false
  );

  if (file) {
    readerImg.readAsDataURL(file);
  }
}

postImgSmall.addEventListener('change', previewSmallPostImg);
postImgLarge.addEventListener('change', previewPostImg);
authorPhoto.addEventListener('change', previewAuthorPhoto);

removeAuthorPhoto.addEventListener('click', () => {
  const previewAuthorPhotos = document.querySelectorAll('.author-photo'); 
  
  document.getElementById("photo").value = '';

  document.querySelector('.camera-icon').classList.add('hidden');
  removeAuthorPhoto.classList.add('hidden');
  document.querySelector('.photo-upload-text').innerHTML = "Upload";
  data.authorPhoto = '';
  data.authorPhotoName = '';
  previewAuthorPhotos.forEach(photo => {
    photo.style.background = ``;
    photo.classList.add('img-empty');
  });
});

removeLargePreviewImg.addEventListener('click', () => {
  document.querySelector('.upload-info_large').classList.remove('hidden');
  document.querySelector('.remove-upload-block-large').style.display = 'none';
  document.getElementById("large-hero-img").value = '';
  
  const previewLargePostImgs = document.querySelectorAll('.preview-post-img'); 
  previewLargePostImgs.forEach(img => {
    img.style.background = '';
    if (img.classList.contains('preview-post-img_large')) {
      img.classList.add('img-empty_large');
    }
  })

  data.postImg = '';
  data.postImgName = '';
})

content.addEventListener('input', () => {
  data.content = content.value;
})

removeSmallPreviewImg.addEventListener('click', () => {
  document.querySelector('.upload-info_small').classList.remove('hidden');
  document.querySelector('.remove-upload-block-small').style.display = 'none';
  document.getElementById("small-hero-img").value = '';
  
  const previewsmallPostImgs = document.querySelectorAll('.small-preview-img'); 
  previewsmallPostImgs.forEach(img => {
    img.style.background = '';
    if (img.classList.contains('preview-post-img_small')) {
      img.classList.add('img-empty_small');
    }
  })
});

publishButton.addEventListener('click', async () => {
  console.log(data);
  await fetch('api/post', {
    method: 'POST',
    body: JSON.stringify(data)
  });
})
