import * as fs from 'fs/promises';
import * as path from 'path';
import * as readline from 'readline';

const rl : readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Student {
    public id: number;
    public name: string;
    public age: number;
    public className: string;

    constructor( id: number, name: string, age: number, className: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.className = className;

    }
}

class StudentManagement {
    public listStudents : Student[] = [];

    public async writeFile(): Promise<void>  {
        try {
            await fs.writeFile('text2.txt', this.listStudents.map(x => {
                return `${x.id}, ${x.name}, ${x.age}, ${x.className}\n`;
            }));
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }
    public questionAsync(prompt: string) : Promise<string> {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    }

    public async addStudent(student: Student): Promise<void> {
        student = {
            id: parseInt(await this.questionAsync('Id: ')),
            name: await this.questionAsync('Tên: '),
            age: parseInt(await this.questionAsync('Tuổi: ')),
            className: await this.questionAsync('Lớp: ')
        };

        this.listStudents.push(student);

        const answer = await this.questionAsync('\nBạn có muốn tiếp tục thêm sinh viên khác không? Nếu có nhập Y, ngược lại nhấn phím bất kỳ để thoát: ');

        if (answer.toLowerCase() === 'y') {
            await this.addStudent(student);
        } else {
            await this.writeFile();
        }
    }
}