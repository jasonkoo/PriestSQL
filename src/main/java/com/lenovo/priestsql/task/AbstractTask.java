package com.lenovo.priestsql.task;

public abstract class AbstractTask implements Task{
	private String id;
	private String name;
	private TaskState taskState;
	private long startTime;
	private long finishTime;
	private Throwable throwable;
	
	public AbstractTask(String name) {
		this.name = name;
		this.taskState = TaskState.NEW;
	}
	
	public void setId(String id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setTaskState(TaskState taskState) {
		this.taskState = taskState;
	}

	void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	void setFinishTime(long finishTime) {
		this.finishTime = finishTime;
	}

	public void setThrowable(Throwable throwable) {
		this.throwable = throwable;
	}

	@Override
	public String getName() {
		return this.name;
	}

	@Override
	public String getId() {
		return this.id;
	}

	@Override
	public TaskState getTaskState() {
		return this.taskState;
	}

	@Override
	public long getStartTime() {
		return this.startTime;
	}

	@Override
	public long getFinishTime() {
		return this.finishTime;
	}

	@Override
	public Throwable getThrowable() {
		return this.throwable;
	}
}