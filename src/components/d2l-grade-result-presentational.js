import './d2l-grade-result-icon-button.js';
import './d2l-grade-result-numeric-score.js';
import './d2l-grade-result-letter-score.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { css, html, LitElement } from 'lit-element';
import getLocalizationTranslations from './locale.js';
import { GradeType } from '../controller/Grade.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export class D2LGradeResultPresentational extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			gradeType: { type: String },
			labelText: { type: String },
			scoreDenominator: { type: Number },
			scoreNumerator: { type: Number },
			letterGradeOptions: { type: Array },
			selectedLetterGrade: { type: String },
			gradeButtonUrl: { type: String },
			reportsButtonUrl: { type: String },
			gradeButtonTooltip: { type: String },
			reportsButtonTooltip: { type: String },
			readOnly: { type: Boolean },
			isGradeAutoCompleted: { type: Boolean },
			isManualOverrideActive: { type: Boolean },
			hideTitle: { type: Boolean },
			customManualOverrideText: { type: String },
			customManualOverrideClearText: { type: String }
		};
	}

	static get styles() {
		return css`
			.d2l-grade-result-presentational-container {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-left: 12px;
			}
			.d2l-grade-result-presentational-title-container {
				padding-left: 12px;
			}
		`;
	}
	static async getLocalizeResources(langs) {
		return await getLocalizationTranslations(langs);
	}

	constructor() {
		super();
		this.readOnly = false;
		this.gradeButtonUrl = '';
		this.reportsButtonUrl = '';
		this.selectedLetterGrade = '';
		this.isGradeAutoCompleted = false;
		this.isManualOverrideActive = false;
		this.hideTitle = false;
		this.customManualOverrideText = undefined;
		this.customManualOverrideClearText = undefined;
	}

	_onGradeButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-button-click', {
			bubbles: true,
			composed: true,
		}));

		this._openGradeEvaluationDialog();
	}

	_onReportsButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-reports-button-click', {
			bubbles: true,
			composed: true,
		}));
		
		this._openGradeStatisticsDialog();
	}

	_isReadOnly() {
		if (this.isGradeAutoCompleted && !this.isManualOverrideActive) {
			return true;
		}
		return Boolean(this.readOnly);
	}

	_renderNumericScoreComponent() {
		return html`
			<d2l-grade-result-numeric-score
				.scoreNumerator=${this.scoreNumerator}
				.scoreDenominator=${this.scoreDenominator}
				.readOnly=${this._isReadOnly()}
			></d2l-grade-result-numeric-score>
		`;
	}

	_renderLetterScoreComponent() {
		return html`
			<d2l-grade-result-letter-score
				.availableOptions=${this.letterGradeOptions}
				.selectedOption=${this.selectedLetterGrade}
				.readOnly=${this._isReadOnly()}
			></d2l-grade-result-letter-score>
		`;
	}

	_renderScoreComponent() {
		if (this.gradeType === GradeType.Number) {
			return this._renderNumericScoreComponent();
		} else if (this.gradeType === GradeType.Letter) {
			return this._renderLetterScoreComponent();
		} else {
			throw new Error('INVALID GRADE TYPE PROVIDED');
		}
	}

	_renderManualOverrideButtonComponent() {
		if (this.isGradeAutoCompleted) {
			let text, icon, onClick;

			if (this.isManualOverrideActive) {
				text = this.customManualOverrideClearText ? this.customManualOverrideClearText : this.localize('clearManualOverride');
				icon = 'tier1:close-default';
				onClick = this._onManualOverrideClearClick;
			} else {
				text = this.customManualOverrideText ? this.customManualOverrideText : this.localize('manuallyOverrideGrade');
				icon = 'tier1:edit';
				onClick = this._onManualOverrideClick;
			}

			return html`
				<d2l-button-subtle
					text=${text}
					icon=${icon}
					@click=${onClick}
				></d2l-button-subtle>
			`;
		}

		return html``;
	}

	_renderTitle() {
		if (!this.hideTitle && this.labelText) {
			return html`
				<span class="d2l-input-label">
					${this.labelText}
				</span>
			`;
		}

		return html``;
	}

	_onManualOverrideClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-manual-override-click', {
			composed: true,
			bubbles: true
		}));
	}

	_onManualOverrideClearClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-manual-override-clear-click', {
			composed: true,
			bubbles: true
		}));
	}

	_openGradeEvaluationDialog() {

		const dialogUrl = this.gradeButtonUrl

		if (!dialogUrl) {
			return;
		}

		const location = new D2L.LP.Web.Http.UrlLocation(dialogUrl);

		const buttons = [
			{
				Key: 'save',
				Text: this.localize('saveBtn'),
				ResponseType: 1, // D2L.Dialog.ResponseType.Positive
				IsPrimary: true,
				IsEnabled: true
			},
			{
				Text: this.localize('cancelBtn'),
				ResponseType: 2, // D2L.Dialog.ResponseType.Negative
				IsPrimary: false,
				IsEnabled: true
			}
		];

		const delayedResult = D2L.LP.Web.UI.Legacy.MasterPages.Dialog.Open(
			/*               opener: */ document.body,
			/*             location: */ location,
			/*          srcCallback: */ 'SrcCallback',
			/*       resizeCallback: */ '',
			/*      responseDataKey: */ 'result',
			/*                width: */ 1920,
			/*               height: */ 1080,
			/*            closeText: */ this.localize('editor.btnCloseDialog'),
			/*              buttons: */ buttons,
			/* forceTriggerOnCancel: */ false
		);
	}

	_openGradeStatisticsDialog() {

		const dialogUrl = this.reportsButtonUrl

		if (!dialogUrl) {
			return;
		}

		const location = new D2L.LP.Web.Http.UrlLocation(dialogUrl);

		const buttons = [
			{
				Key: 'close',
				Text: this.localize('closeBtn'),
				ResponseType: 1, // D2L.Dialog.ResponseType.Positive
				IsPrimary: true,
				IsEnabled: true
			}
		];

		const delayedResult = D2L.LP.Web.UI.Legacy.MasterPages.Dialog.Open(
			/*               opener: */ document.body,
			/*             location: */ location,
			/*          srcCallback: */ 'SrcCallback',
			/*       resizeCallback: */ '',
			/*      responseDataKey: */ 'result',
			/*                width: */ 1920,
			/*               height: */ 1080,
			/*            closeText: */ this.localize('editor.btnCloseDialog'),
			/*              buttons: */ buttons,
			/* forceTriggerOnCancel: */ false
		);
	}

	render() {
		return html`
			<div class="d2l-grade-result-presentational-title-container">
				${this._renderTitle()}
			</div>

			<div class="d2l-grade-result-presentational-container">
				${this._renderScoreComponent()}

				${this.gradeButtonUrl ?  html`
					<d2l-grade-result-icon-button
						.tooltipText=${this.gradeButtonTooltip}
						ariaLabel="Grades"
						icon="tier1:grade"
						@d2l-grade-result-icon-button-click=${this._onGradeButtonClick}
					></d2l-grade-result-icon-button>
				` : html``}
				
				${this.reportsButtonUrl ? html`
					<d2l-grade-result-icon-button
						.tooltipText=${this.reportsButtonTooltip}
						ariaLabel="Reports"
						icon="tier1:reports"
						@d2l-grade-result-icon-button-click=${this._onReportsButtonClick}
					></d2l-grade-result-icon-button>
				` : html``}

			</div>

			${this._renderManualOverrideButtonComponent()}
		`;
	}
}

customElements.define('d2l-labs-d2l-grade-result-presentational', D2LGradeResultPresentational);
