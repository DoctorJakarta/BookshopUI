export class Subject {
    public id: number;
    public parentName: string;
    public subjectName: string;
    public code: string;

    constructor ( id: number, parentName: string, subjectName: string) {
      this.id = id;
      this.parentName = parentName;
      this.subjectName = subjectName;
   }
}
