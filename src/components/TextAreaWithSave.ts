type TextAreaProps = {
  formEle: HTMLElement | null;
  ele: HTMLTextAreaElement | null;
  saveBtn: HTMLButtonElement | null;
  clickSaveBtnCallback?: (evt: MouseEvent) => void;
  maxCharNum: number;
};

export class TextAreaWithSave {
  public isDisabled = false;
  public isReadonly = false;
  private formEle: HTMLElement | null = null;
  private ele: HTMLTextAreaElement | null = null;
  private saveBtn: HTMLButtonElement | null = null;
  private clickSaveBtnCallback?: (evt: MouseEvent) => void;
  private charNumEle: HTMLElement | null = null;
  private maxCharNum = 9999;
  private defaultValue = '';

  constructor(props: TextAreaProps) {
    const _ = this;

    _.formEle = props.formEle;
    _.ele = props.ele;
    _.saveBtn = props.saveBtn;
    _.clickSaveBtnCallback = props.clickSaveBtnCallback;
    _.maxCharNum = props.maxCharNum;
    _.charNumEle = document.querySelector('.form__char-num');
    _.defaultValue = '';

    return _;
  }

  public init(): TextAreaWithSave {
    const _ = this;

    _.defaultValue = _.ele?.value || '';

    _.ele?.addEventListener('input', function (evt): void {
      const str: string = this.value;

      // limit max number of characters that user input.
      if (str.length > _.maxCharNum) {
        evt.preventDefault();
        _.setValue(str.substr(0, _.maxCharNum));
      }

      // update states
      _.updateCharNum();
      _.updateState(_.ele?.value || '');
    });

    if (_.clickSaveBtnCallback) _.saveBtn?.addEventListener('click', _.clickSaveBtnCallback);

    _.updateCharNum();

    return _;
  }

  // public
  public setDisabled(flag: boolean): TextAreaWithSave {
    const _ = this;

    if (flag) {
      if (_.ele) _.ele.disabled = true;
      _.isDisabled = true;
    } else {
      if (_.ele) _.ele.disabled = false;
      _.isDisabled = false;
    }

    return _;
  }

  public setReadOnly(flag: boolean): TextAreaWithSave {
    const _ = this;

    if (flag) {
      if (_.ele) _.ele.readOnly = true;
      _.isReadonly = true;
    } else {
      if (_.ele) _.ele.readOnly = false;
      _.isReadonly = false;
    }

    return _;
  }

  // getter
  public getValue(): string {
    return this.ele ? this.ele.value : '';
  }

  // setter
  public setValue(str: string): TextAreaWithSave {
    if (this.ele) this.ele.value = str;
    return this;
  }

  // protected methods
  protected updateState(value: string): TextAreaWithSave {
    const _ = this,
      formEle = _.formEle;

    if (_.defaultValue === value) {
      formEle?.classList.remove('form--changed');
      formEle?.classList.add('form--default');
    } else {
      formEle?.classList.remove('form--default');
      formEle?.classList.add('form--changed');
    }

    return _;
  }

  protected updateCharNum(): TextAreaWithSave {
    const _ = this;

    if (_.charNumEle) {
      const charNum: number = _.maxCharNum - (_.ele?.value.length || 0);
      _.charNumEle.innerText = `${charNum}`;
    }

    return _;
  }
}
