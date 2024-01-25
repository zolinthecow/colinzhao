import { injectable } from 'inversify';
import 'reflect-metadata';
import IAIService from './AIService.interface';

@injectable()
export default class AIService implements IAIService {
  private _test: string;

  constructor() {
    this._test = 'hi';
  }

  public test() {
    return this._test;
  }
}
