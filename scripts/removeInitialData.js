import bootstrap from './bootstrap';
import mongoose from 'mongoose';

bootstrap();

var Quest = mongoose.model('Quest');
var Task = mongoose.model('Task');

Quest.remove({});
Task.remove({});
