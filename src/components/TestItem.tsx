import React from 'react';
import {Test} from '../types/models';

interface TestItemProps {
    test: Test;
}

const TestItem: React.FC<TestItemProps> = ({ test }) => {
    return (
        <li style={{ marginBottom: '10px' }}>
            <strong>{test.testName}</strong>
            <p>{test.testDescription}</p>
        </li>
    );
};

export default TestItem;