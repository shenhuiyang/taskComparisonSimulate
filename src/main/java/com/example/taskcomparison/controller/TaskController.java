package com.example.taskcomparison.controller;

import com.example.taskcomparison.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/get-taskid/{taskID}")
    public String getTaskID(@PathVariable String taskID) {
        return taskService.getTaskID(taskID);
    }

    @GetMapping("/get-success/{taskID}")
    public String getSuccess(@PathVariable String taskID) {
        return taskService.getSuccess(taskID);
    }

    @GetMapping("/get-error/{taskID}")
    public String getError(@PathVariable String taskID) {
        return taskService.getError(taskID);
    }

    @PostMapping("/get-new-taskid")
    public Map<String, String> getNewTaskID(@RequestBody Map<String, String> request) {
        return taskService.getNewTaskID(request.get("taskID"));
    }

    @GetMapping("/taskPercent")
    public Map<String, Integer> getTaskPercent() {
        return taskService.getTaskPercent();
    }

    @PostMapping("/resetProgress")
    public void resetProgress() {
        taskService.resetProgress();
    }
}
