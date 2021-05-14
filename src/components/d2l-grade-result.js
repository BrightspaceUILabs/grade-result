import './d2l-grade-result-presentational.js';
import { Grade, GradeType } from '../controller/Grade.js';
import { html, LitElement } from 'lit-element';
import { GradesController } from '../controller/GradesController.js';
import { LocalizeGradeResult } from '../../localize-grade-result.js';

export class D2LGradeResult extends LocalizeGradeResult(LitElement) {
	static get properties() {
		return {
			href: { type: String },
			token: { type: String },
			disableAutoSave: { type: Boolean },
			customManualOverrideText: { type: String },
			customManualOverrideClearText: { type: String },

			_labelText: { type: String },
			_readOnly: { type: Boolean },
			_hideTitle: { type: Boolean },

			_grade: { type: Object },
			_manuallyOverriddenGrade: { type: Object },
			_controller: { type: Object },

			_hasUnsavedChanged: { type: Boolean },
			_includeGradeButton: { type: Boolean },
			_includeReportsButton: { type: Boolean },
			_gradeButtonTooltip: { type: String },
			_reportsButtonTooltip: { type: String },
			_isGradeAutoCompleted: { type: Boolean },
		};
	}

	constructor() {
		super();

		this._href = undefined;
		this._token = undefined;
		this.disableAutoSave = false;
		this.customManualOverrideText = undefined;
		this.customManualOverrideClearText = undefined;

		this._readOnly = false;
		this._labelText = '';
		this._hideTitle = false;
		this._grade = new Grade(GradeType.Number, 0, 0, null, null, null);

		// hard coded as disabled as not yet supported by API
		this._includeGradeButton = false;
		this._includeReportsButton = false;
		this._gradeButtonTooltip = undefined;
		this._reportsButtonTooltip = undefined;
		this._isGradeAutoCompleted = false;

		this._manuallyOverriddenGrade = undefined;
		this._controller = undefined;
		this._hasUnsavedChanged = false;
	}

	get href() {
		return this._href;
	}

	set href(val) {
		const oldVal = this.href;
		if (oldVal !== val) {
			this._href = val;
			if (this._href && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	get token() {
		return this._token;
	}

	set token(val) {
		const oldVal = this.token;
		if (oldVal !== val) {
			this._token = val;
			if (this._href && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	async _initializeController() {
		try {
			this._controller = new GradesController(this._href, this._token);
			await this._requestGrade();
			this._emitInitializedSuccess();
		} catch (e) {
			this._emitInitializedError(e);
		}
	}

	/* --- public methods --- */

	hasUnsavedChanges() {
		return this._hasUnsavedChanged;
	}

	async saveGrade() {
		try {
			this._grade = await this._controller.updateGrade(this._grade);
			this._hasUnsavedChanged = false;
			this._emitGradeSavedSuccess();
		} catch (e) {
			this._emitGradeSavedError(e);
		}
	}

	/* --- emit events --- */

	_emitInitializedSuccess() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-initialized-success', {
			composed: true,
			bubbles: true
		}));
	}

	_emitInitializedError(e) {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-initialized-error', {
			composed: true,
			bubbles: true,
			detail: {
				error: e
			}
		}));
	}

	_emitGradeUpdatedSuccess() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-updated-success', {
			composed: true,
			bubbles: true,
			detail: {
				grade: this._grade
			}
		}));
	}

	_emitGradeUpdatedError(e) {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-updated-error', {
			composed: true,
			bubbles: true,
			detail: {
				error: e
			}
		}));
	}

	_emitGradeSavedSuccess() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-saved-success', {
			composed: true,
			bubbles: true,
			detail: {
				grade: this._grade
			}
		}));
	}

	_emitGradeSavedError(e) {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-saved-error', {
			composed: true,
			bubbles: true,
			detail: {
				error: e
			}
		}));
	}

	/* --- private methods --- */

	async _requestGrade() {
		this._grade = await this._controller.requestGrade(true);
		this._hasUnsavedChanged = false;
	}

	/* --- event handlers --- */

	async _handleGradeChange(e) {
		try {
			const score = e.detail.value;
			this._grade.setScore(score);
			this._emitGradeUpdatedSuccess();
			this._hasUnsavedChanged = true;
			if (!this.disableAutoSave) {
				await this.saveGrade();
			}
		} catch (e) {
			this._emitGradeUpdatedError(e);
		}
	}

	_handleManualOverrideClick() {
		this._manuallyOverriddenGrade = this._grade;
		this.dispatchEvent('d2l-grade-result-manual-override-click', {
			composed: true,
			bubbles: true
		});
	}

	_handleManualOverrideClearClick() {
		this._grade = this._manuallyOverriddenGrade;
		this._manuallyOverriddenGrade = undefined;
		this.dispatchEvent('d2l-grade-result-manual-override-clear-click', {
			composed: true,
			bubbles: true
		});
	}

	render() {
		const gradeType = this._grade.getScoreType();
		let score = this._grade.getScore();
		const scoreOutOf = this._grade.getScoreOutOf();

		// handle when grade is not yet initialized on the server
		if (gradeType === GradeType.Number && score === null) {
			score = 0;
		} else if (gradeType === GradeType.Letter && score === null) {
			score = '';
		}

		return html`
			<d2l-labs-d2l-grade-result-presentational
				labelText=${this.localize('overallGrade')}
				.gradeType=${gradeType}
				scoreNumerator=${score}
				scoreDenominator=${scoreOutOf}
				.letterGradeOptions=${scoreOutOf}
				selectedLetterGrade=${score}
				.customManualOverrideText=${this.customManualOverrideText}
				.customManualOverrideClearText=${this.customManualOverrideClearText}

				gradeButtonTooltip=${this._gradeButtonTooltip}
				reportsButtonTooltip=${this._reportsButtonTooltip}
				?includeGradeButton=${this._includeGradeButton}
				?includeReportsButton=${this._includeReportsButton}

				?isGradeAutoCompleted=${this._isGradeAutoCompleted}
				?isManualOverrideActive=${this._manuallyOverriddenGrade !== undefined}

				?readOnly=${this._readOnly}
				?hideTitle=${this._hideTitle}

				@d2l-grade-result-grade-change=${this._handleGradeChange}
				@d2l-grade-result-letter-score-selected=${this._handleGradeChange}
				@d2l-grade-result-manual-override-click=${this._handleManualOverrideClick}
				@d2l-grade-result-manual-override-clear-click=${this._handleManualOverrideClearClick}
			></d2l-labs-d2l-grade-result-presentational>
		`;
	}
}

customElements.define('d2l-labs-d2l-grade-result', D2LGradeResult);
