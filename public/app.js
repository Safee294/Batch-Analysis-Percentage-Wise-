function App() {
    return {
        open: false,
        batch: {},
        batches: [],
        students: [],
        marks: [],
        batchPercentages: {},
        gradeDistribution: {},

        async getBatches() {
            const response = await fetch(`/api/batches`).then(res => res.json());
            this.batches = response;
        },

        async loadBatchDetails(batchId) {
            this.batch = this.batches.find(b => b.rid == batchId) || {};
            this.students = await fetch(`/api/students?batch=${batchId}`).then(res => res.json());
            this.marks = await fetch(`/api/marks?batch=${batchId}`).then(res => res.json());
            this.calculateBatchAnalysis(batchId);
        },

        calculateBatchAnalysis(batchId) {
            let batchMarks = this.marks.filter(m => m.rid == batchId);
            let studentPercentages = {};
            let gradeDist = { A: 0, B: 0, C: 0, D: 0, F: 0 };

            this.students.forEach(student => {
                let studentMarks = batchMarks.filter(m => m.regno == student.regno);
                let totalObtained = studentMarks.reduce((sum, m) => sum + Number(m.marks), 0);
                let totalPossible = studentMarks.length * 100; // If each subject is out of 100
                let percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
                let grade = this.getGrade(percentage);
                studentPercentages[student.regno] = { percentage, grade };
                gradeDist[grade]++;
            });

            let percentages = Object.values(studentPercentages).map(s => s.percentage);
            let avg = percentages.length ? (percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0;
            let highest = percentages.length ? Math.max(...percentages) : 0;
            let lowest = percentages.length ? Math.min(...percentages) : 0;

            this.batchPercentages[batchId] = { average: avg, highest, lowest, studentPercentages };
            this.gradeDistribution[batchId] = gradeDist;
        },

        getGrade(percentage) {
            if (percentage >= 85) return 'A';
            if (percentage >= 70) return 'B';
            if (percentage >= 55) return 'C';
            if (percentage >= 40) return 'D';
            return 'F';
        }
    }
}