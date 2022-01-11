//
// Created by josh on 1/11/22.
//
#define SDL_MAIN_HANDLED

#include <SDL2/SDL.h>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/async.h>
#include <spdlog/sinks/basic_file_sink.h>
#include <filesystem>
#include <memory>
#include "rendering_engine.h"

/// run the renderer in a loop
static void run() {
    auto renderingEngine = std::make_unique<RenderingEngine>();
    bool running = true;
    while (running) {
        // input event loop
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            switch (event.type) {
                case SDL_QUIT:
                    running = false;
                    break;
            }
        }

        //todo render stuff here
    }
}

static void initLogging() {
    using namespace spdlog;
    init_thread_pool(8192, 1);
    auto stdoutSink = std::make_shared<sinks::stdout_color_sink_mt>();
    auto fileSink = std::make_shared<sinks::basic_file_sink_mt>(
            std::filesystem::temp_directory_path().append("dragonfire_engine_log.txt").string());
    std::vector<sink_ptr> sinks{stdoutSink, fileSink};
    auto logger = std::make_shared<async_logger>("engine_log", sinks.begin(), sinks.end(), thread_pool(),
                                                 async_overflow_policy::block);
    register_logger(logger);
}

int main(int argc, char **argv) {
    initLogging();
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_EVENTS)) {
        auto msg = SDL_GetError();
        SDL_Quit();
        SPDLOG_CRITICAL("SDL initialization failed: {}", msg);
        exit(-1);
    }

    // log the version of sdl2 loaded
    {
        SDL_version version;
        SDL_GetVersion(&version);
        spdlog::info("SDL version {}.{}.{} initialized", version.major, version.minor, version.patch);
    }
    run();
    spdlog::shutdown();
    SDL_Quit();
}