

export interface IInputErrorState
{
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}