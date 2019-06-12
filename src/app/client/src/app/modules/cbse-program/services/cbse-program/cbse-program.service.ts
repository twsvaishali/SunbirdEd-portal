import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ActionService } from '@sunbird/core';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import * as _ from 'lodash-es';
import { themeObject, stageObject, questionSetObject, questionObject, questionSetConfigCdataObject } from './data';
import { UUID } from 'angular2-uuid';
@Injectable({
  providedIn: 'root'
})
export class CbseProgramService {
  constructor(private configService: ConfigService, public actionService: ActionService) { }

  getQuestionDetails(questionId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    return this.actionService.get(req);
  }

  getECMLJSON(collections: Array<string>) {
    const theme = _.cloneDeep(themeObject);
    const stage = _.cloneDeep(stageObject);
    const questionSet = _.cloneDeep(questionSetObject);
    stage.id = UUID.UUID();
    theme.startStage = stage.id;
    questionSet.id = UUID.UUID();
    questionSet.data.__cdata.push({ identifier: questionSet.id });
    const questionSetConfigCdata = questionSetConfigCdataObject;

    return of(collections)
      .pipe(mergeMap((collectionIds: Array<string>) => {
        if (collectionIds.length > 0) {
          return forkJoin(_.map(collectionIds, (collectionId: string) => {
            const req = {
              url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${collectionId}`
            };
            return this.actionService.get(req).pipe(
              map(res => {
                const question = _.cloneDeep(questionObject);
                const questionConfigCdata: any = {};
                question.id = UUID.UUID();
                questionConfigCdata.question = _.get(res, 'result.assessment_item.body');
                const media = _.map(_.get(res, 'result.assessment_item.media'), (mediaObj) => {
                  delete mediaObj.baseUrl;
                  return mediaObj;
                });
                questionConfigCdata.media = media;
                if (_.get(res, 'result.assessment_item.type') === 'reference') {
                  questionConfigCdata.solution = _.get(res, 'result.assessment_item.solutions');
                }
                if (_.get(res, 'result.assessment_item.type') === 'mcq') {
                  questionSetConfigCdata.show_feedback = true;
                  questionSetConfigCdata.shuffle_questions = false;
                  questionConfigCdata.responseDeclaration = _.get(res, 'result.assessment_item.responseDeclaration');
                }
                questionSetConfigCdata.total_items = collectionIds.length;
                questionConfigCdata.questionCount = 0;
                question.data.__cdata = JSON.stringify(questionConfigCdata);
                question.config.__cdata = JSON.stringify(question.config.__cdata);
                return question;
              }),
              catchError(err => of(err))
            );
          }));
        }
      }))
      .pipe(
        map(questions => {
          const questionMedia = _.flattenDeep(_.map(questions, question => {
            return JSON.parse(question.data.__cdata).media ? JSON.parse(question.data.__cdata).media : [];
          }));
          theme.manifest.media = _.concat(theme.manifest.media, questionMedia);
          questionSet.config.__cdata = JSON.stringify(questionSetConfigCdata);
          questionSet.data.__cdata = JSON.stringify(questionSet.data.__cdata);
          questionSet['org.ekstep.question'] = questions;
          stage['org.ekstep.questionset'].push(questionSet);
          theme.stage.push(stage);
          return { 'theme': theme };
        })
      );
  }
}