package com.example.taskcomparison.controller;

import com.example.taskcomparison.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/formula")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/index/getIndexRequestFile/{taskID}")
    public String getTaskID(@PathVariable String taskID) {
        return taskService.getTaskID(taskID);
    }

    @GetMapping("/pricing/getCalcResult/{taskID}")
    public String getCalcResult(@PathVariable String taskID) {
        // Logic to handle the request and return the success result
        return taskService.getSuccess(taskID);
    }

    @GetMapping("/pricing/get-error/{taskID}")
    public String getError(@PathVariable String taskID) {
        return taskService.getError(taskID);
    }

    @PostMapping("/pricing/get-new-taskid")
    public Map<String, String> getNewTaskID(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isCompressed", defaultValue = "false") boolean isCompressed,
            @RequestParam(value = "assetType", defaultValue = "insurance") String assetType) {

        // Process the file and parameters
        String newTaskID = taskService.processNewTask(file, isCompressed, assetType);

        Map<String, String> response = new HashMap<>();
        response.put("newTaskID", newTaskID);
        return response;
    }

    @GetMapping("/pricing/taskPercent")
    public Map<String, Integer> getTaskPercent() {
        return taskService.getTaskPercent();
    }

    @PostMapping("/pricing/resetProgress")
    public void resetProgress() {
        taskService.resetProgress();
    }

    @GetMapping("/pricing/config/{key}")
    public Map<String, String> getConfig(@PathVariable String key) {
        Map<String, String> response = new HashMap<>();
        switch (key) {
            case "download-url":
                response.put("url", taskService.getDownloadUrl());
                break;
            case "success-url":
                response.put("url", taskService.getSuccessUrl());
                break;
            case "error-url":
                response.put("url", taskService.getErrorUrl());
                break;
            case "progress-url":
                response.put("url", taskService.getProgressUrl());
                break;
            case "new-taskid-url":
                response.put("url", taskService.getNewTaskIdUrl());
                break;
            case "download-path":
                response.put("url", taskService.getDownloadPath());
                break;
            default:
                response.put("url", "");
        }
        return response;
    }

    @GetMapping("/pricing/getBatchErrorLog")
    public String getBatchErrorLog(@RequestParam("jobid") String jobId) {
        // Logic to handle the request and return the error log
        return taskService.getError(jobId);
    }

    @GetMapping("/pricing/queryBatchJobStatus")
    public Map<String, Integer> queryBatchJobStatus(@RequestParam("jobid") String jobId,
                                                    @RequestParam("isLogging") boolean isLogging) {
        // Logic to handle the request and return the job status
        return taskService.getTaskPercent();
    }

    @PostMapping("/pricing/calcBondValuation")
    public Map<String, String> calcBondValuation(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isCompressed", defaultValue = "false") boolean isCompressed,
            @RequestParam(value = "assetType", defaultValue = "insurance") String assetType) {

        // 确保处理文件和参数的逻辑正确
        String newTaskID = taskService.processNewTask(file, isCompressed, assetType);

        Map<String, String> response = new HashMap<>();
        response.put("newTaskID", newTaskID);
        return response;
    }
}
