export interface ISubmitFeedbackRequest {
  email: string;
  message: string;
  name: string;
}

export interface ISubmitFeedbackResponse extends ISubmitFeedbackRequest {
  id: string;
  submittedAt: string;
}
