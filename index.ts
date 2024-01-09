// import * as fs from 'fs/promises';

// import * as path from 'path';
// import * as readlineSync from 'readline-sync';
const fs = require('fs').promises;
const path = require('path');
const readlineSync = require('readline-sync');  

class Student {
    public id: number;
    public name: string;
    public age: number;
    public className: string;

    constructor(id: number, name: string, age: number, className: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.className = className;
    }
}

class StudentManagement {
    public listStudents: Student[] = [];

    public async writeFile(): Promise<void> {
        try {
            await fs.writeFile('text2.txt', this.listStudents.map(x => {
                return `${x.id}, ${x.name}, ${x.age}, ${x.className}\n`;
            }).join(''));
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }

    public async addStudent(): Promise<void> {
        const id = readlineSync.questionInt("Nhap id: ");
        const name = readlineSync.question("Nhap ten: ");
        const age = readlineSync.questionInt("Nhap tuoi: ");
        const className = readlineSync.question("Nhap lop: ");
        const student = new Student(id, name, age, className);
        this.listStudents.push(student);

        const answer = readlineSync.question('\nBan co muon tiep tuc? Neu co thi nhan phim Y, nguoc lai nhan phim bat ki.');

        if (answer.toLowerCase() === 'y') {
            await this.addStudent();
        } else {
            await this.writeFile();
        }
    }

    public async listData(): Promise<Student[]> {
        try {
            const data = await fs.readFile(path.resolve('./text2.txt'), { encoding: 'utf8' });
            const students = data.split('\n').filter(Boolean).map(studentString => {
                const [id, name, age, className] = studentString.split(', ');
                return new Student(parseInt(id), name, parseInt(age), className);
            });

            return students;
        } catch (error) {
            console.error('Error reading from file:', error);
            return [];
        }
    }

    public async viewListStudent(): Promise<void> {
        const data = await this.listData();
        console.log('Danh sách sinh viên: \n');
        data.forEach((item) => {
            console.log(`Id: ${item.id}, Tên: ${item.name}, Tuổi: ${item.age}, Lớp: ${item.className}`);
        });
    }

    public async searchStudentByName(name: string): Promise<void> {
        const data = await this.listData();
        const foundStudents = data.filter(student => student.name.toLowerCase() === name.toLowerCase());

        if (foundStudents.length === 0) {
            console.log('Không tìm thấy sinh viên có tên là', name);
        } else {
            console.log('\nSinh viên có tên', name, 'được tìm thấy:');
            foundStudents.forEach((student, index) => {
                console.log(`#${index + 1}: Tên: ${student.name}, Tuổi: ${student.age}, Lớp: ${student.className}`);
            });
        }
    }
}

async function main() {
    const management = new StudentManagement();
    while (true) {
        console.log("Menu:");
        console.log("1. Xem danh sách sinh viên");
        console.log("2. Thêm sinh viên");
        console.log("3. Tìm kiếm sinh viên");
        console.log("4. Thoát");

        const choice = readlineSync.questionInt("Ban muon chon chuc nang: ");

        switch (choice) {
            case 1:
                await management.viewListStudent();
                break;
            case 2:
                await management.addStudent();
                console.log("Thêm sinh viên thành công");
                break;
            case 3:
                const searchName = readlineSync.question("Nhap ten sinh vien can tim: ");
                await management.searchStudentByName(searchName);
                break;
            case 4:
                console.log("Đã thoát chương trình");
                process.exit(0);
            default:
                console.log("Chức năng không hợp lệ, vui lòng chọn lại.");
        }
    }
}

main();
