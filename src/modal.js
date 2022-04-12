'use strict';

export default class Modal {
  constructor() {
    this.modal = document.querySelector('.modal');
    this.modalMsg = this.modal.querySelector('p');
    this.modalBtn = this.modal.querySelector('button');
    this.modalBtn.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  show(text) {
    this.modalMsg.textContent = text;
    this.modal.style.display = 'block';
  }

  hide() {
    this.modal.style.display = 'none';
  }
}